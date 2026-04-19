import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

/**
 * POST /api/contact
 *
 * Simple contact form endpoint. Validates input, applies a naive in-memory
 * rate limit per IP, and delivers via Resend if RESEND_API_KEY is set.
 * Falls back to logging when no key is configured (dev mode).
 *
 * Env vars:
 *   RESEND_API_KEY       — Resend secret (re_xxx)
 *   CONTACT_TO_EMAIL     — inbox to receive messages (default daniel.mirond@gmail.com)
 *   CONTACT_FROM_EMAIL   — verified sender (default "Mundiales <hola@mundiales-de-futbol.com>")
 */

const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? 'daniel.mirond@gmail.com';
const CONTACT_FROM = process.env.CONTACT_FROM_EMAIL ?? 'Mundiales de Fútbol <onboarding@resend.dev>';

// Naive rate limit: 5 messages per IP per hour. Reset on server restart.
const HITS = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function hitOk(ip: string) {
  const now = Date.now();
  const bucket = HITS.get(ip);
  if (!bucket || bucket.resetAt < now) {
    HITS.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  bucket.count++;
  return bucket.count <= LIMIT;
}

function sanitize(s: string, max = 5000) {
  return s.replace(/[\u0000-\u001F]/g, '').slice(0, max).trim();
}

function validEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const honeypot = (body.website as string | undefined)?.trim();
  if (honeypot) {
    // Bots fill this hidden field. Pretend success.
    return NextResponse.json({ ok: true });
  }

  const name = sanitize(String(body.name ?? ''), 120);
  const email = sanitize(String(body.email ?? ''), 254);
  const subject = sanitize(String(body.subject ?? ''), 200);
  const message = sanitize(String(body.message ?? ''), 5000);
  const consent = Boolean(body.consent);

  if (!name || !validEmail(email) || !message || message.length < 10) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ error: 'consent_required' }, { status: 400 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  if (!hitOk(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const payload = {
    from: CONTACT_FROM,
    to: [CONTACT_TO],
    replyTo: email,
    subject: `[Mundiales] ${subject || `Mensaje de ${name}`}`,
    text: [
      `De: ${name} <${email}>`,
      `IP: ${ip}`,
      `Asunto: ${subject || '(sin asunto)'}`,
      '',
      message,
      '',
      '—',
      'Enviado desde mundiales-de-futbol.com · formulario de contacto',
    ].join('\n'),
  };

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Dev-mode fallback — print to server logs so you can test locally.
    console.log('[contact] (no RESEND_API_KEY)', payload);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send(payload);
    if (error) {
      console.error('[contact] resend error', error);
      return NextResponse.json({ error: 'send_failed' }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true, id: data?.id });
  } catch (err) {
    console.error('[contact] send exception', err);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
}

export const runtime = 'nodejs';
