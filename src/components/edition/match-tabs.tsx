'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Swords, FileText, Sparkles, ArrowRight, Info } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

type Tab = 'h2h' | 'preview' | 'curiosity';

/**
 * Tabs interactivos para MatchCard variant="full".
 *
 * 3 tabs:
 *  1. H2H        — enfrentamientos históricos. Placeholder hasta conectar a
 *                  Supabase con queries cruzadas team_a vs team_b en
 *                  matches.tournament_year != tournament_year actual.
 *  2. Preview    — crónica corta del partido. Placeholder hasta tener
 *                  contenido editorial en match_articles / tournament_stories.
 *  3. Curiosity  — si el partido es iconic (Mano de Dios, Maracanazo, etc.)
 *                  o tiene una historia del calendario editorial
 *                  referenciada, se muestra. Si no, mensaje "sin curiosidad
 *                  documentada".
 *
 * Cliente component porque maneja estado de tab seleccionada.
 */
export function MatchTabs({
  iconic,
  linkedStory,
  homeName,
  awayName,
  stage,
}: {
  iconic: string | null;
  linkedStory: { slug: string; title: string; excerpt: string; locale: Locale } | null;
  homeName: string;
  awayName: string;
  stage: string;
}) {
  const t = useTranslations('matchCard.tabs');
  const [tab, setTab] = useState<Tab>(iconic || linkedStory ? 'curiosity' : 'h2h');

  const tabs: { key: Tab; label: string; Icon: typeof Swords }[] = [
    { key: 'h2h', label: t('h2h'), Icon: Swords },
    { key: 'preview', label: t('preview'), Icon: FileText },
    { key: 'curiosity', label: t('curiosity'), Icon: Sparkles },
  ];

  return (
    <div>
      {/* Tab headers */}
      <div
        role="tablist"
        aria-label={t('tablistLabel')}
        className="flex flex-wrap gap-1 border-b border-[var(--color-border)]"
      >
        {tabs.map(({ key, label, Icon }) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            aria-controls={`panel-${key}`}
            id={`tab-${key}`}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 border-b-2 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
              tab === key
                ? 'border-[var(--color-pitch)] text-[var(--color-pitch)]'
                : 'border-transparent text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
            }`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="pt-5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
        {tab === 'h2h' && (
          <Panel id="h2h">
            <Empty
              icon={<Swords className="h-5 w-5 text-[var(--color-fg-subtle)]" />}
              title={t('h2hEmptyTitle', { home: homeName, away: awayName })}
              hint={t('h2hEmptyHint')}
            />
          </Panel>
        )}

        {tab === 'preview' && (
          <Panel id="preview">
            <Empty
              icon={<FileText className="h-5 w-5 text-[var(--color-fg-subtle)]" />}
              title={t('previewEmptyTitle', { stage })}
              hint={t('previewEmptyHint')}
            />
          </Panel>
        )}

        {tab === 'curiosity' && (
          <Panel id="curiosity">
            {iconic || linkedStory ? (
              <div className="space-y-4">
                {iconic && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-sun)]/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-sun)]">
                    <Sparkles className="h-3 w-3" />
                    {iconic}
                  </div>
                )}
                {linkedStory ? (
                  <>
                    <h4 className="font-display text-xl uppercase leading-tight text-[var(--color-fg)]">
                      {linkedStory.title}
                    </h4>
                    <p className="text-sm leading-relaxed">{linkedStory.excerpt}</p>
                    <Link
                      href={withLocale(
                        linkedStory.locale,
                        `/historias/${linkedStory.slug}`,
                      )}
                      className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
                    >
                      {t('readStory')}
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </Link>
                  </>
                ) : (
                  <p className="text-sm leading-relaxed">
                    {t('iconicNoStory')}
                  </p>
                )}
              </div>
            ) : (
              <Empty
                icon={<Info className="h-5 w-5 text-[var(--color-fg-subtle)]" />}
                title={t('curiosityEmptyTitle')}
                hint={t('curiosityEmptyHint')}
              />
            )}
          </Panel>
        )}
      </div>
    </div>
  );
}

function Panel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`}>
      {children}
    </div>
  );
}

function Empty({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <div className="text-sm text-[var(--color-fg)]">{title}</div>
        {hint && (
          <div className="mt-1 text-xs text-[var(--color-fg-subtle)]">{hint}</div>
        )}
      </div>
    </div>
  );
}
