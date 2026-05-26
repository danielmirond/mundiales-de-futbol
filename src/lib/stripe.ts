import Stripe from 'stripe';

/**
 * Server-side Stripe client. Uses STRIPE_SECRET_KEY from env.
 * Do NOT import this from client components.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
  appInfo: {
    name: 'mundiales-de-futbol',
    url: 'https://mundiales-de-futbol.com',
  },
});

export const PORRA_PRICE = {
  amount: 299, // €2.99 in cents
  currency: 'eur',
  productName: 'Pase Mundial 2026 — Porra Premium',
  productDescription:
    'Acceso completo a la porra del Mundial 2026: predicciones por partido (104 partidos), ligas privadas ilimitadas y estadísticas avanzadas. Pago único, sin renovaciones.',
} as const;
