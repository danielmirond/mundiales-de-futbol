/**
 * Reacciones del directo.
 *  GET  ?cards=id1,id2  → { [card]: { counts, recent } }
 *  POST { card, reaction } → una por tarjeta y visitante (hash diario de IP+UA).
 * Usa la service role en servidor; la tabla no es accesible con la clave pública.
 */
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { ALL_REACTIONS, type CardReactions } from '@/lib/feed-reactions';

export const dynamic = 'force-dynamic';

const CARD = /^[a-z0-9-]{4,40}$/;
const db = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

export async function GET(req: Request) {
  const cards = (new URL(req.url).searchParams.get('cards') ?? '').split(',').filter((c) => CARD.test(c)).slice(0, 20);
  if (cards.length === 0) return Response.json({});
  const s = db();
  const [{ data: counts }, { data: recent }] = await Promise.all([
    s.from('feed_reaction_counts').select('card_id, reaction, n').in('card_id', cards),
    s.from('feed_reactions').select('card_id, reaction, created_at').in('card_id', cards).order('created_at', { ascending: false }).limit(60),
  ]);
  const out: Record<string, CardReactions> = Object.fromEntries(cards.map((c) => [c, { counts: {}, recent: [] }]));
  for (const r of counts ?? []) out[r.card_id].counts[r.reaction] = r.n;
  for (const r of recent ?? []) if (out[r.card_id].recent.length < 12) out[r.card_id].recent.push({ reaction: r.reaction, at: r.created_at });
  return Response.json(out, { headers: { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=20' } });
}

export async function POST(req: Request) {
  let body: { card?: string; reaction?: string };
  try { body = await req.json(); } catch { return Response.json({ error: 'json' }, { status: 400 }); }
  const card = String(body.card ?? ''), reaction = String(body.reaction ?? '');
  if (!CARD.test(card) || !ALL_REACTIONS.has(reaction)) return Response.json({ error: 'invalid' }, { status: 400 });
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim();
  const day = new Date().toISOString().slice(0, 10);
  const voter = createHash('sha256').update(`${ip}|${req.headers.get('user-agent') ?? ''}|${day}|${process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-12)}`).digest('hex').slice(0, 32);
  // Una reacción por tarjeta: si ya reaccionó, se cambia la reacción.
  const { error } = await db().from('feed_reactions').upsert({ card_id: card, reaction, voter, created_at: new Date().toISOString() }, { onConflict: 'card_id,voter' });
  if (error) return Response.json({ error: 'db' }, { status: 500 });
  return Response.json({ ok: true });
}
