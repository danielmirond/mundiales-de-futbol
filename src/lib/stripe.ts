import Stripe from 'stripe';

/**
 * Server-side Stripe client (lazy init).
 * Do NOT import this from client components.
 *
 * Lazy initialization: we don't instantiate `new Stripe()` at module level,
 * because Next.js evaluates imports during build-time page data collection
 * and STRIPE_SECRET_KEY may not be defined in build env yet. Initializing
 * lazily on first call defers it to runtime, when the env var is present.
 */
let cachedStripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (cachedStripe) return cachedStripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  cachedStripe = new Stripe(key, {
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
    appInfo: {
      name: 'mundiales-de-futbol',
      url: 'https://mundiales-de-futbol.com',
    },
  });
  return cachedStripe;
}

/**
 * @deprecated Use `getStripe()` instead. Kept for backwards compat with code
 * that imported `stripe` as a value. Calling `stripe.<x>` resolves lazily.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return Reflect.get(getStripe(), prop);
  },
});

export const PORRA_PRICE = {
  amount: 299, // €2.99 in cents
  currency: 'eur',
  productName: 'Pase Mundial 2026 — Porra Premium',
  productDescription:
    'Acceso completo a la porra del Mundial 2026: predicciones por partido (104 partidos), ligas privadas ilimitadas y estadísticas avanzadas. Pago único, sin renovaciones.',
} as const;
