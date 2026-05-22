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

    // Automated refund rule engine — fires on every refund event
    if (event.type === 'charge.refund.updated' || event.type === 'charge.refunded') {
      const charge = event.data.object;
      const refundObj = charge.refunds?.data?.[0] || {};
      const chargeId = charge.id;
      const amountUsd = (refundObj.amount || charge.amount_refunded || 0) / 100;
      const customerEmail = charge.billing_details?.email || charge.receipt_email || '';

      // Fetch customer subscription data for CLV / plan / tenure
      let clv = 0, plan = '', tenureMonths = 0;
      if (customerEmail) {
        const subs = await base44.asServiceRole.entities.Subscription.filter({ user_email: customerEmail });
        if (subs.length > 0) {
          const sub = subs[0];
          plan = sub.plan || '';
          clv = sub.mrr ? sub.mrr * 12 : 0; // rough CLV estimate
          tenureMonths = sub.signup_date
            ? Math.floor((Date.now() - new Date(sub.signup_date).getTime()) / (1000 * 60 * 60 * 24 * 30))
            : 0;
        }
      }

      // Load active rules and evaluate
      const allRules = await base44.asServiceRole.entities.RefundRule.list('priority', 200);
      const activeRules = allRules.filter(r => r.is_active);
      let matchedRule = null;
      let action = 'no_rule_match';
      const riskScore = 0.3; // default — no live risk score from Stripe; use a conservative value

      for (const rule of activeRules) {
        const clvMin = rule.clv_min ?? -Infinity;
        const clvMax = rule.clv_max ?? Infinity;
        const riskMin = rule.risk_score_min ?? -Infinity;
        const riskMax = rule.risk_score_max ?? Infinity;
        const amtMin = rule.amount_min ?? -Infinity;
        const amtMax = rule.amount_max ?? Infinity;
        const tenureMin = rule.tenure_min_months ?? 0;
        const planMatch = !rule.plans || rule.plans.length === 0 || rule.plans.includes(plan);

        if (clv >= clvMin && clv <= clvMax && riskScore >= riskMin && riskScore <= riskMax
          && amountUsd >= amtMin && amountUsd <= amtMax && tenureMonths >= tenureMin && planMatch) {
          matchedRule = rule;
          action = rule.action;
          break;
        }
      }

      let stripeRefundId = null;
      if (action === 'auto_approve' && chargeId) {
        const stripe2 = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
        const refund = await stripe2.refunds.create({
          charge: chargeId,
          amount: Math.round(amountUsd * 100),
        });
        stripeRefundId = refund.id;
        console.log(`Webhook auto-approved refund: ${stripeRefundId}`);
      }

      await base44.asServiceRole.entities.RefundAuditLog.create({
        transaction_id: chargeId,
        customer_email: customerEmail,
        amount: amountUsd,
        risk_score: riskScore,
        clv,
        plan,
        rule_id: matchedRule?.id || '',
        rule_name: matchedRule?.name || '',
        action_taken: action,
        stripe_refund_id: stripeRefundId || '',
        source: 'webhook',
        notes: matchedRule ? `Matched: "${matchedRule.name}" (priority ${matchedRule.priority})` : 'No rule matched',
      });

      if (matchedRule) {
        await base44.asServiceRole.entities.RefundRule.update(matchedRule.id, {
          match_count: (matchedRule.match_count || 0) + 1,
          last_matched_at: new Date().toISOString(),
        });
      }

      console.log(`Refund rule engine: txn=${chargeId} action=${action}`);
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