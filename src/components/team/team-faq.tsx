import type { Faq } from '@/lib/team-faq';

/** Bloque visible de preguntas frecuentes (respuesta directa en la primera frase). */
export function FaqBlock({ title, items, kicker = 'Preguntas frecuentes', width = 'max-w-[1400px]' }: { title: string; items: Faq[]; kicker?: string; width?: string }) {
  if (items.length === 0) return null;
  return (
    <section className={`mx-auto mt-10 w-full ${width} px-6 md:px-10`} aria-labelledby="faq-title">
      <div className="kicker" style={{ color: 'var(--color-gold)' }}>{kicker}</div>
      <h2 id="faq-title" className="t-h2 mt-3 text-[var(--color-fg)]">{title}</h2>
      <dl className="mt-6 grid gap-3 md:grid-cols-2">
        {items.map((f) => (
          <div key={f.q} className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
            <dt className="text-[17px] font-semibold leading-snug text-[var(--color-fg)]">{f.q}</dt>
            <dd className="mt-2 text-[15px] leading-relaxed text-[var(--color-fg-muted)]">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export const faqLd = (items: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
