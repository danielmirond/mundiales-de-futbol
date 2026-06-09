import { NextResponse } from 'next/server';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com').trim();

/**
 * Alias de conveniencia: /rss.xml → /feed.xml (301).
 * Muchos lectores de feeds y agregadores prueban /rss.xml por convención.
 * El feed canónico vive en /feed.xml.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.redirect(`${SITE}/feed.xml`, 301);
}
