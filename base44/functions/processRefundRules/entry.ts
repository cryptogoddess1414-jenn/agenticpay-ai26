import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

/**
 * Evaluates a transaction against active RefundRules (sorted by priority).
 * Returns the first matching rule's action, or 'no_rule_match'.
 *
 * Payload expected:
 * {
 *   transaction_id: string,   // Stripe charge ID
 *   customer_email: string,
 *   amount: number,           // USD
 *   risk_score: number,       // 0-1
 *   clv: number,              // USD
 *   plan: string,
 *   tenure_months: number,
 *   auto_execute: boolean     // if true, actually call Stripe to issue refund
 * }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const {
      transaction_id,
      customer_email,
      amount,
      risk_score,
      clv,
      plan,
      tenure_months = 0,
      auto_execute = false,
    } = payload;

    // Load all active rules sorted by priority ascending
    const allRules = await base44.asServiceRole.entities.RefundRule.list('priority', 200);
    const activeRules = allRules.filter(r => r.is_active);

    // Evaluate rules in priority order
    let matchedRule = null;
    let action = 'no_rule_match';

    for (const rule of activeRules) {
      const clvMin = rule.clv_min ?? -Infinity;
      const clvMax = rule.clv_max ?? Infinity;
      const riskMin = rule.risk_score_min ?? -Infinity;
      const riskMax = rule.risk_score_max ?? Infinity;
      const amtMin = rule.amount_min ?? -Infinity;
      const amtMax = rule.amount_max ?? Infinity;
      const tenureMin = rule.tenure_min_months ?? 0;

      const clvMatch = clv >= clvMin && clv <= clvMax;
      const riskMatch = risk_score >= riskMin && risk_score <= riskMax;
      const amtMatch = amount >= amtMin && amount <= amtMax;
      const tenureMatch = tenure_months >= tenureMin;
      const planMatch = !rule.plans || rule.plans.length === 0 || rule.plans.includes(plan);

      if (clvMatch && riskMatch && amtMatch && tenureMatch && planMatch) {
        matchedRule = rule;
        action = rule.action;
        break;
      }
    }

    console.log(`Rule evaluation: txn=${transaction_id} action=${action} rule=${matchedRule?.name ?? 'none'}`);

    let stripeRefundId = null;

    // If auto_approve and auto_execute, issue refund via Stripe
    if (action === 'auto_approve' && auto_execute && transaction_id) {
      const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
      const refund = await stripe.refunds.create({
        charge: transaction_id,
        amount: Math.round(amount * 100), // Stripe uses cents
      });
      stripeRefundId = refund.id;
      console.log(`Stripe refund issued: ${stripeRefundId}`);
    }

    // Write audit log
    await base44.asServiceRole.entities.RefundAuditLog.create({
      transaction_id,
      customer_email: customer_email || '',
      amount,
      risk_score,
      clv,
      plan: plan || '',
      rule_id: matchedRule?.id || '',
      rule_name: matchedRule?.name || '',
      action_taken: action,
      stripe_refund_id: stripeRefundId || '',
      source: 'manual',
      notes: matchedRule ? `Matched rule: "${matchedRule.name}" (priority ${matchedRule.priority})` : 'No rule matched',
    });

    // Update rule match count
    if (matchedRule) {
      await base44.asServiceRole.entities.RefundRule.update(matchedRule.id, {
        match_count: (matchedRule.match_count || 0) + 1,
        last_matched_at: new Date().toISOString(),
      });
    }

    return Response.json({
      action,
      rule: matchedRule ? { id: matchedRule.id, name: matchedRule.name, priority: matchedRule.priority } : null,
      stripe_refund_id: stripeRefundId,
    });
  } catch (error) {
    console.error('processRefundRules error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});