import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response('Webhook Error', { status: 400 });
  }

  const base44 = createClientFromRequest(req);

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const planKey = session.metadata?.plan;
      const customerEmail = session.customer_details?.email || session.customer_email;

      if (planKey && customerEmail) {
        const planMrr = { starter: 29, pro: 79, enterprise: 199 }[planKey] || 0;
        const existingSubs = await base44.asServiceRole.entities.Subscription.filter({ user_email: customerEmail });
        if (existingSubs.length > 0) {
          await base44.asServiceRole.entities.Subscription.update(existingSubs[0].id, {
            plan: planKey,
            status: 'active',
            mrr: planMrr,
          });
        } else {
          await base44.asServiceRole.entities.Subscription.create({
            user_email: customerEmail,
            plan: planKey,
            status: 'active',
            mrr: planMrr,
            signup_date: new Date().toISOString().split('T')[0],
          });
        }
        await base44.asServiceRole.entities.Transaction.create({
          user_email: customerEmail,
          amount: planMrr,
          type: 'charge',
          status: 'succeeded',
          plan: planKey,
          date: new Date().toISOString().split('T')[0],
        });
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      const customer = await new Stripe(Deno.env.get('STRIPE_SECRET_KEY')).customers.retrieve(sub.customer);
      if (customer.email) {
        const existingSubs = await base44.asServiceRole.entities.Subscription.filter({ user_email: customer.email });
        if (existingSubs.length > 0) {
          await base44.asServiceRole.entities.Subscription.update(existingSubs[0].id, {
            status: 'churned',
            churn_date: new Date().toISOString().split('T')[0],
          });
        }
      }
    }

    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object;
      const customer = await new Stripe(Deno.env.get('STRIPE_SECRET_KEY')).customers.retrieve(sub.customer);
      if (customer.email) {
        const existingSubs = await base44.asServiceRole.entities.Subscription.filter({ user_email: customer.email });
        if (existingSubs.length > 0) {
          const statusMap = { active: 'active', past_due: 'active', paused: 'paused', canceled: 'churned' };
          await base44.asServiceRole.entities.Subscription.update(existingSubs[0].id, {
            status: statusMap[sub.status] || 'active',
          });
        }
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
  }

  return Response.json({ received: true });
});