/**
 * IndexNow cron endpoint
 *
 * Protocolo: https://www.indexnow.org/documentation
 * Soportado por Bing, Yandex, Naver, Seznam, Yep (NO Google — Google ignora IndexNow).
 *
 * Flujo:
 *  1. GET /api/cron/indexnow — llamado por Vercel Cron (vercel.json)
 *  2. Recopila las URLs más recientes (noticias últimas 48h + páginas clave)
 *  3. POST a https://api.indexnow.org/indexnow con la lista
 *  4. Bing & co. las encolan para rastreo inmediato
 *
 * Configuración requerida:
 *  - INDEXNOW_KEY env var en Vercel (Settings → Environment Variables)
 *  - El archivo /public/{INDEXNOW_KEY}.txt debe existir con el mismo valor
 *
 * Sin INDEXNOW_KEY → devuelve 503 sin hacer nada.
 */

import { NextResponse } from 'next/server';
import { NEWS_ITEMS } from '@/lib/news';

export const dynamic = 'force-dynamic';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com').replace(/\/$/, '');
const KEY = process.env.INDEXNOW_KEY;

/** URLs estáticas de alto valor que siempre enviamos */
const STATIC_URLS = [
  '/',
  '/noticias',
  '/2026',
  '/2026/convocatorias',
  '/2026/grupos',
  '/2026/calendario',
  '/2026/sedes',
  '/historias',
];

export async function GET(req: Request) {
  // Guard: sin key no hacemos nada
  if (!KEY) {
    return NextResponse.json(
      { error: 'INDEXNOW_KEY not configured', hint: 'Add it in Vercel → Settings → Environment Variables' },
      { status: 503 },
    );
  }

  // Opcional: verificar que la llamada viene de Vercel Cron
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const cutoff48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  // Noticias publicadas en las últimas 48h
  const recentNewsUrls = NEWS_ITEMS
    .filter((n) => {
      const pub = new Date(n.publishedAt);
      return pub >= cutoff48h && pub <= now;
    })
    .map((n) => `${SITE}/noticias/${n.slug}`);

  // Construir lista final de URLs (máximo 10.000 per request, IndexNow limit)
  const urls = [
    ...STATIC_URLS.map((p) => `${SITE}${p}`),
    ...recentNewsUrls,
  ].slice(0, 10_000);

  if (urls.length === 0) {
    return NextResponse.json({ message: 'No URLs to submit', submitted: 0 });
  }

  // POST a IndexNow (distribuye a Bing, Yandex, Naver, Seznam, Yep automáticamente)
  const body = {
    host: new URL(SITE).hostname,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  };

  let indexNowStatus = 0;
  let indexNowBody = '';

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    indexNowStatus = res.status;
    indexNowBody = await res.text().catch(() => '');
  } catch (err) {
    return NextResponse.json(
      { error: 'IndexNow request failed', detail: String(err) },
      { status: 500 },
    );
  }

  // 200 = OK, 202 = accepted (async), 422 = key mismatch, 429 = rate limit
  const success = indexNowStatus === 200 || indexNowStatus === 202;

  return NextResponse.json({
    submitted: urls.length,
    staticUrls: STATIC_URLS.length,
    newsUrls: recentNewsUrls.length,
    indexNowStatus,
    indexNowBody: indexNowBody.slice(0, 200),
    success,
    timestamp: now.toISOString(),
  }, { status: success ? 200 : indexNowStatus });
}
