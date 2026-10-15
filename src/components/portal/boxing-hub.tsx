import Link from 'next/link';
import { proximasVeladas, pasadasVeladas, veladaNombre, fechaLarga, DAZN_AFF, type Velada } from '@/lib/boxeo';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

/** Bloque «dónde ver» de una velada con el enlace de afiliado si es en DAZN. */
export function DondeVerVelada({ v }: { v: Velada }) {
  if (!v.tv) return <p className="text-sm text-[var(--color-fg-muted)]">Retransmisión por confirmar.</p>;
  const dazn = /dazn/i.test(v.tv.plataforma);
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4">
      <span className="text-sm text-[var(--color-fg)]"><strong>{v.tv.plataforma}</strong> · {v.tv.modalidad === 'PPV' ? 'pago por visión (PPV)' : v.tv.modalidad}{v.tv.precio ? ` · ${v.tv.precio}` : ''}</span>
      {dazn && (
        <a href={DAZN_AFF} target="_blank" rel="sponsored nofollow noopener noreferrer" className="ml-auto inline-flex h-10 items-center rounded-full bg-[var(--color-fg)] px-4 text-sm font-semibold text-[var(--color-bg)]">
          Ver en DAZN ↗
        </a>
      )}
      {dazn && <span className="basis-full font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">Enlace de afiliado</span>}
    </div>
  );
}

function Card({ v, locale }: { v: Velada; locale: Locale }) {
  return (
    <article className="flex flex-col gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-ink)]">{fechaLarga(v.fecha)}</span>
        <span className="font-mono text-[11px] text-[var(--color-fg-subtle)]">{v.horaEspana ? `${v.horaEspana} (España)` : 'Hora por confirmar'}</span>
      </div>
      <h3 className="t-h3 text-[var(--color-fg)]">
        <Link href={withLocale(locale, `/combate/boxeo/velada/${v.slug}`)} className="hover:text-[var(--accent-ink)]">{veladaNombre(v)}</Link>
      </h3>
      <p className="text-sm text-[var(--color-fg-muted)]">{[v.titulo, [v.sede, v.ciudad].filter(Boolean).join(', ')].filter(Boolean).join(' · ') || 'Sede por confirmar'}</p>
      <DondeVerVelada v={v} />
    </article>
  );
}

/** Portada de boxeo: próximas veladas y las ya disputadas. */
export function BoxingHub({ locale }: { locale: Locale }) {
  const next = proximasVeladas(), past = pasadasVeladas();
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
      <div className="kicker">Calendario</div>
      <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Próximas veladas</h2>
      {next.length === 0 ? (
        <p className="mt-5 text-[var(--color-fg-muted)]">No hay veladas confirmadas en el calendario.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">{next.map((v) => <Card key={v.slug} v={v} locale={locale} />)}</div>
      )}
      {past.length > 0 && (
        <>
          <h2 className="t-h2 mt-12 text-[var(--color-fg)]">Veladas anteriores</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">{past.map((v) => <Card key={v.slug} v={v} locale={locale} />)}</div>
        </>
      )}
    </section>
  );
}
