import { createClient } from '@/lib/supabase/server';

export type PorraProfile = {
  user_id: string;
  display_name: string;
  slug: string;
  has_premium: boolean;
  total_points: number;
};

/**
 * Server-side helper. Returns the current authenticated porra user with
 * premium status, or null if not logged in / not registered.
 */
export async function getPorraProfile(): Promise<PorraProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('porra_users')
    .select('user_id, display_name, slug, has_premium, total_points')
    .eq('user_id', user.id)
    .maybeSingle();

  return (data as PorraProfile | null) ?? null;
}

export async function requirePremium(locale: string): Promise<PorraProfile> {
  const profile = await getPorraProfile();
  const { redirect } = await import('next/navigation');
  if (!profile) {
    redirect(`/${locale}/porra/login?next=${encodeURIComponent(`/${locale}/porra/upgrade`)}`);
    throw new Error('unreachable');
  }
  if (!profile.has_premium) {
    redirect(`/${locale}/porra/upgrade`);
    throw new Error('unreachable');
  }
  return profile;
}
