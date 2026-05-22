import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const PLANS = {
  starter: {
    name: 'Starter',
    priceId: 'price_1TZka9EeJ3ieZh0Q6hVLM9Nq',
    amount: 29,
  },
  pro: {
    name: 'Pro',
    priceId: 'price_1TZka8EeJ3ieZh0QM4DA6sox',
    amount: 79,
  },
  enterprise: {
    name: 'Enterprise',
    priceId: 'price_1TZka9EeJ3ieZh0QS7A8WPdm',
    amount: 199,
  },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const body = await req.json();
    const { action } = body;

    // Get or create Stripe customer
    const getOrCreateCustomer = async () => {
      const existing = await stripe.customers.list({ email: user.email, limit: 1 });
      if (existing.data.length > 0) return existing.data[0];
      return await stripe.customers.create({
        email: user.email,
        name: user.full_name || user.email,
        metadata: { base44_user_id: user.id, base44_app_id: Deno.env.get('BASE44_APP_ID') },
      });
    };

    if (action === 'get_subscription') {
      const customer = await getOrCreateCustomer();
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 1,
        expand: ['data.default_payment_method', 'data.items.data.price.product'],
      });
      const sub = subscriptions.data[0] || null;
      const paymentMethods = await stripe.paymentMethods.list({ customer: customer.id, type: 'card' });
      return Response.json({ subscription: sub, paymentMethods: paymentMethods.data, customerId: customer.id });
    }

    if (action === 'create_checkout') {
      const { planKey } = body;
      const plan = PLANS[planKey];
      if (!plan) return Response.json({ error: 'Invalid plan' }, { status: 400 });

      const customer = await getOrCreateCustomer();

      // Check if running in iframe
      const origin = req.headers.get('origin') || req.headers.get('referer') || '';

      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [{ price: plan.priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${origin}/billing?success=true`,
        cancel_url: `${origin}/billing?cancelled=true`,
        metadata: { base44_app_id: Deno.env.get('BASE44_APP_ID'), plan: planKey },
      });

      return Response.json({ url: session.url });
    }

    if (action === 'create_portal') {
      const customer = await getOrCreateCustomer();
      const origin = req.headers.get('origin') || req.headers.get('referer') || '';
      const session = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: `${origin}/billing`,
      });
      return Response.json({ url: session.url });
    }

    if (action === 'get_invoices') {
      const customer = await getOrCreateCustomer();
      const invoices = await stripe.invoices.list({ customer: customer.id, limit: 10 });
      return Response.json({ invoices: invoices.data });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Billing error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});