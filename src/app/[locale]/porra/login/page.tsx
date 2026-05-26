import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { LoginForm } from './login-form';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/porra/login',
    title: 'Entrar a la Porra Mundial 2026',
    description: 'Accede con tu email a la porra del Mundial 2026.',
    noIndex: true,
  });
}

export default async function PorraLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; error?: string; sent?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect(`/${locale}/porra/predicciones`);
  }

  const sp = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-semibold">Entrar a la porra</h1>
      <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
        Te enviaremos un enlace mágico a tu email. Sin contraseñas.
      </p>
      <LoginForm next={sp.next} />
      {sp.error ? (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {decodeURIComponent(sp.error)}
        </p>
      ) : null}
      {sp.sent ? (
        <p className="mt-4 text-sm text-[var(--color-pitch)]" role="status">
          Te hemos enviado un enlace. Revisa tu bandeja de entrada (y la carpeta de spam).
        </p>
      ) : null}
    </main>
  );
}
