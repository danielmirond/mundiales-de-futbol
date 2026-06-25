'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createClient();
    const origin = window.location.origin;
    const callback = `${origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callback },
    });
    setSubmitting(false);
    if (error) {
      router.replace(`?error=${encodeURIComponent(error.message)}`);
    } else {
      router.replace('?sent=1');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
      <label className="text-xs uppercase tracking-wider text-[var(--color-fg-muted)]" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-12 rounded-full border border-[var(--color-border-strong)] bg-transparent px-5 text-base outline-none placeholder:text-[var(--color-fg-muted)] focus:border-[var(--color-pitch)]"
      />
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? 'Enviando…' : 'Enviar enlace mágico'}
      </Button>
      <p className="mt-2 text-[11px] text-[var(--color-fg-muted)]">
        Al registrarte aceptas nuestro <a className="underline" href="/es/privacidad">aviso de privacidad</a>.
      </p>
    </form>
  );
}
