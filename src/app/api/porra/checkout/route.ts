import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe, PORRA_PRICE } from '@/lib/stripe';

/**
 * Creates a Stripe Checkout Session for the Pase Mundial 2026 (€2.99).
 * Requires authenticated user. Returns the Checkout URL for redirect.
 *
 * Idempotency: if the user already has has_premium = true, returns 409.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 });
  }

  // Check existing premium status
  const { data: profile } = await supabase
    .from('porra_users')
    .select('has_premium, stripe_customer_id, display_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profile?.has_premium) {
    return NextResponse.json({ error: 'already_premium' }, { status: 409 });
  }

  const { origin } = new URL(request.url);
  const locale = request.nextUrl.searchParams.get('locale') || 'es';
  const successUrl = `${origin}/${locale}/porra/upgrade/exito?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/${locale}/porra/upgrade`;

  // Reuse Stripe customer if we already have one
  let customerId = profile?.stripe_customer_id ?? undefined;
  if (!customerId && user.email) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from('porra_users')
      .update({ stripe_customer_id: customerId })
      .eq('user_id', user.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: PORRA_PRICE.currency,
          unit_amount: PORRA_PRICE.amount,
          product_data: {
            name: PORRA_PRICE.productName,
            description: PORRA_PRICE.productDescription,
          },
          // tax_behavior inclusive: el precio mostrado ya incluye IVA.
          // Stripe Tax (si está activado) lo desglosa en el recibo.
          tax_behavior: 'inclusive',
        },
      },
    ],
    automatic_tax: { enabled: true },
    success_url: successUrl,
    cancel_url: cancelUrl,
    locale: locale === 'es' ? 'es' : 'auto',
    metadata: {
      supabase_user_id: user.id,
      product: 'porra_mundial_2026_pass',
    },
    // Consentimiento de inicio inmediato del servicio digital → renuncia
    // al derecho de desistimiento (art. 103.m TR-LGDCU). Lo capturamos
    // via consent_collection.
    consent_collection: {
      terms_of_service: 'required',
    },
    custom_text: {
      terms_of_service_acceptance: {
        message:
          'Acepto los [Términos y Condiciones](https://mundiales-de-futbol.com/es/legal/terminos) y la [Política de Privacidad](https://mundiales-de-futbol.com/es/privacidad). Entiendo que el servicio comenzará inmediatamente y renuncio al derecho de desistimiento (art. 103.m TR-LGDCU).',
      },
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: 'session_no_url' }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
