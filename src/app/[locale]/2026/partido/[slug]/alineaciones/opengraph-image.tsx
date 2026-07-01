import { ImageResponse } from 'next/og';
import { TEAMS_2026, getFixtureBySlug } from '@/lib/wc-2026';
import { fetchScores, buildScoreMap, scoreKey } from '@/lib/live-scores';
import { fetchMatchSummary } from '@/lib/wc-2026-match-summary';
import { resolveKnockoutFixture } from '@/lib/wc-2026-knockout';

/**
 * Imagen 1200×975 de ALINEACIONES por partido (onces + formación).
 * Sirve como og:image de la página y es embebible por su URL.
 * Datos en vivo de ESPN; si aún no hay onces, muestra "por confirmar".
 */
export const runtime = 'edge';
export const size = { width: 1200, height: 975 };
export const contentType = 'image/png';
export const alt = 'Alineaciones · Mundial 2026';

const tName = (c?: string, fb?: string) => (c && TEAMS_2026[c]?.name) || fb || c || 'Por definir';
const tFlag = (c?: string) => (c && TEAMS_2026[c]?.flag) || '🏳️';

function Column({
  team, flag, formation, players,
}: {
  team: string; flag: string; formation: string | null;
  players: { jersey: string; name: string }[];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '48%', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', fontSize: '30px', fontWeight: 700, color: '#f5f6f8' }}>
          {flag} {team}
        </div>
        {formation ? (
          <div style={{ display: 'flex', fontFamily: 'monospace', fontSize: '22px', color: '#4ede80' }}>{formation}</div>
        ) : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
        {players.slice(0, 11).map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '5px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', width: '34px', fontFamily: 'monospace', fontSize: '18px', color: '#9ea3ad' }}>
              {p.jersey || '·'}
            </div>
            <div style={{ display: 'flex', fontSize: '22px', color: '#e7e9ec' }}>{p.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AlineacionesOg({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  let f = getFixtureBySlug(slug);
  // Eliminatorias: resolver equipos reales desde ESPN (fixture = partido-N).
  if (f && f.stage.length !== 1 && (!f.home || !f.away)) {
    const r = await resolveKnockoutFixture(f.n);
    if (r?.home && r?.away) f = { ...f, home: r.home, away: r.away };
  }
  const hn = tName(f?.home, f?.label);
  const an = tName(f?.away);

  let summary = null;
  try {
    if (f?.home && f?.away) {
      const sc = buildScoreMap(await fetchScores()).get(scoreKey(f.home, f.away));
      if (sc?.id) summary = await fetchMatchSummary(sc.id, f.home, f.away);
    }
  } catch {
    /* sin datos → versión "por confirmar" */
  }

  const has = !!summary?.hasLineups;
  const map = (arr: { name: string; jersey: string }[] = []) =>
    arr.map((p) => ({ name: p.name, jersey: p.jersey }));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '56px 64px',
          background: 'linear-gradient(135deg, #05060a 0%, #0b0d14 50%, #101319 100%)',
          fontFamily: 'system-ui, sans-serif', color: '#f5f6f8', position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '-220px', right: '-220px', width: '600px', height: '600px', borderRadius: '50%', background: '#4ede80', opacity: 0.16, display: 'flex', filter: 'blur(40px)' }} />
        {/* kicker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#4ede80', display: 'flex' }} />
          <div style={{ display: 'flex', fontFamily: 'monospace', fontSize: '22px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#4ede80' }}>
            Alineaciones · Mundial 2026
          </div>
        </div>
        {/* matchup */}
        <div style={{ display: 'flex', fontSize: '52px', fontWeight: 800, textTransform: 'uppercase', zIndex: 2 }}>
          {tFlag(f?.home)} {hn} <span style={{ color: '#6b7280', margin: '0 16px', display: 'flex' }}>vs</span> {an} {tFlag(f?.away)}
        </div>

        {has ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
            <Column team={hn} flag={tFlag(f?.home)} formation={summary!.formationHome} players={map(summary!.startHome)} />
            <Column team={an} flag={tFlag(f?.away)} formation={summary!.formationAway} players={map(summary!.startAway)} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 2 }}>
            <div style={{ display: 'flex', fontSize: '34px', color: '#e7e9ec' }}>Onces por confirmar</div>
            <div style={{ display: 'flex', fontSize: '24px', color: '#9ea3ad' }}>Las alineaciones se publican aproximadamente una hora antes del partido.</div>
          </div>
        )}

        {/* footer */}
        <div style={{ display: 'flex', fontFamily: 'monospace', fontSize: '22px', letterSpacing: '0.2em', color: '#9ea3ad', zIndex: 2 }}>
          mundiales-de-futbol.com
        </div>
      </div>
    ),
    { ...size },
  );
}
