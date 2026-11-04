import { getCompetition } from '@/lib/competitions';
import { WatchGuideLink } from '@/components/affiliate/watch-guide-link';
import { WatchGuideScope } from '@/components/affiliate/watch-guide-scope';
import type { Locale } from '@/i18n/routing';

/**
 * Todas las subpáginas de una competición (clasificación, calendario,
 * resultados, equipos, jugadores…) enlazan al pie su guía «Dónde ver».
 */
export default async function CompetitionLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; deporte: string; competicion: string }> }) {
  const { locale, deporte, competicion } = await params;
  const c = getCompetition(deporte, competicion);
  const soon = c && !c.espn && !c.href && !c.stats;
  return (
    <>
      {children}
      {c && !soon && (
        <WatchGuideScope root={`/${deporte}/${competicion}`}>
          <WatchGuideLink compSlug={c.slug} compName={c.name} locale={locale as Locale} className="mb-12 mt-4" />
        </WatchGuideScope>
      )}
    </>
  );
}
