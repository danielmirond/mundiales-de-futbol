import { matchWeather, OUTDOOR_SPORTS, type WeatherIcon } from '@/lib/match-weather';

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports';
const hourFmt = new Intl.DateTimeFormat('es', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });

async function espnVenue(espn: { sport: string; league: string }, id: string) {
  try {
    const r = await fetch(`${ESPN}/${espn.sport}/${espn.league}/summary?event=${id}`, { headers: { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' }, next: { revalidate: 3600 } });
    const v = r.ok ? (await r.json())?.gameInfo?.venue : null;
    return v ? { venue: v.fullName as string | undefined, city: v.address?.city as string | undefined, country: v.address?.country as string | undefined, indoor: v.indoor === true } : null;
  } catch { return null; }
}

/** Icono de trazo (sin emoji), heredando el color del texto. */
function Icon({ name }: { name: WeatherIcon }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const cloud = <path {...p} d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 11.2 3.5 3.5 0 0 0 7 18z" />;
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
      {name === 'sol' && (<><circle {...p} cx="12" cy="12" r="4.5" /><path {...p} d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>)}
      {name === 'noche' && <path {...p} d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />}
      {name === 'nubes-claros' && (<><path {...p} d="M8 6.5a4 4 0 0 1 7.3 1.2" /><path {...p} d="M8 3v1M3.8 7.2l.9.6" />{cloud}</>)}
      {name === 'nubes' && cloud}
      {name === 'lluvia' && (<>{cloud}<path {...p} d="M9 20.5l-1 2M13 20.5l-1 2M17 20.5l-1 2" transform="translate(0 -2.5)" /></>)}
      {name === 'tormenta' && (<>{cloud}<path {...p} d="M12.5 15l-2 3.5h3l-2 3.5" transform="translate(0 -1.5)" /></>)}
      {name === 'nieve' && (<>{cloud}<path {...p} d="M9 21h.01M13 21h.01M17 21h.01" transform="translate(0 -1.5)" /></>)}
      {name === 'niebla' && <path {...p} d="M4 9h16M3 13h18M5 17h14" />}
    </svg>
  );
}

/**
 * «El tiempo en el estadio»: previsión a la hora del partido (antes y durante).
 * Solo deportes al aire libre y estadios no cubiertos; sin previsión, no pinta nada.
 */
export async function MatchWeatherBlock({ sport, espn, id, kickoff }: { sport: string; espn: { sport: string; league: string }; id: string; kickoff?: string }) {
  if (!kickoff || !OUTDOOR_SPORTS.has(sport)) return null;
  const v = await espnVenue(espn, id);
  if (!v) return null;
  const w = await matchWeather({ ...v, kickoff });
  if (!w) return null;
  const facts = [
    w.temp !== null && { k: 'Temperatura', v: `${w.temp} °C` },
    w.rainProb !== null && w.rainProb !== undefined ? { k: 'Prob. de lluvia', v: `${w.rainProb} %` } : w.rainMm !== null && w.rainMm !== undefined ? { k: 'Lluvia', v: `${w.rainMm.toLocaleString('es-ES')} mm/h` } : null,
    w.wind !== null && { k: 'Viento', v: `${w.wind} km/h` },
  ].filter(Boolean) as { k: string; v: string }[];
  return (
    <section className="mx-auto mt-6 w-full max-w-[1000px] px-6 md:px-10" aria-labelledby="tiempo-estadio">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
        <div className="flex items-center gap-3 text-[var(--accent-ink)]">
          <Icon name={w.icon} />
          <div>
            <h2 id="tiempo-estadio" className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">El tiempo en el estadio</h2>
            <div className="mt-1 text-[15px] font-semibold text-[var(--color-fg)]">{w.sky}</div>
            <div className="text-[13px] text-[var(--color-fg-muted)]">{v.venue ?? w.place}{v.city ? ` · ${v.city}` : ''} · a las {hourFmt.format(new Date(kickoff))}</div>
          </div>
        </div>
        <dl className="flex flex-wrap gap-x-6 gap-y-2">
          {facts.map((f) => (
            <div key={f.k}><dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">{f.k}</dt><dd className="mt-0.5 text-lg font-semibold tab-num text-[var(--color-fg)]">{f.v}</dd></div>
          ))}
        </dl>
        <p className="w-full font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          Previsión: {w.source === 'aemet' ? <a href="https://www.aemet.es" target="_blank" rel="noopener" className="underline decoration-[var(--color-border)]">AEMET</a> : <a href="https://www.met.no/en" target="_blank" rel="noopener" className="underline decoration-[var(--color-border)]">MET Norway</a>}{w.source === 'met' ? ' (CC BY 4.0)' : ''}
        </p>
      </div>
    </section>
  );
}
