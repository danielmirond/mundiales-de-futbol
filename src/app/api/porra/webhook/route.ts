import { NextResponse, type NextRequest } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

/**
 * Stripe webhook. Receives payment events and updates porra_users.has_premium.
 *
 * Configure in Stripe Dashboard:
 * - Endpoint: https://mundiales-de-futbol.com/api/porra/webhook
 * - Events: checkout.session.completed, charge.refunded
 * - Signing secret: STRIPE_WEBHOOK_SECRET env var
 *
 * Uses SERVICE_ROLE_KEY to bypass RLS (webhook has no user session).
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function adminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json({ error: `invalid_signature: ${message}` }, { status: 400 });
  }

  const supabase = adminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const supabaseUserId = session.metadata?.supabase_user_id;
      if (!supabaseUserId) {
        return NextResponse.json({ received: true, warning: 'no_user_id_in_metadata' });
      }

      const amount = session.amount_total ?? null;
      const currency = session.currency ?? null;

      const { error } = await supabase
        .from('porra_users')
        .update({
          has_premium: true,
          stripe_session_id: session.id,
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : undefined,
          purchased_at: new Date().toISOString(),
          purchase_amount: amount,
          purchase_currency: currency,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', supabaseUserId);

      if (error) {
        console.error('webhook: failed to mark premium', error);
        return NextResponse.json({ received: true, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ received: true, action: 'premium_granted' });
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      // Find user by stripe_customer_id, revoke premium
      const customerId = typeof charge.customer === 'string' ? charge.customer : null;
      if (customerId) {
        const { error } = await supabase
          .from('porra_users')
          .update({
            has_premium: false,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);
        if (error) {
          console.error('webhook: failed to revoke premium on refund', error);
        }
      }
      return NextResponse.json({ received: true, action: 'premium_revoked_on_refund' });
    }

    default:
      return NextResponse.json({ received: true, ignored: event.type });
  }
}
