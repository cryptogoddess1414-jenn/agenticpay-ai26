// Shared mock data generators for risk management

const CUSTOMERS = [
  { id: 'cus_001', name: 'Acme Corp', email: 'billing@acme.com', plan: 'enterprise', clv: 48200, tenure: 36, successRate: 0.97 },
  { id: 'cus_002', name: 'TechFlow Inc', email: 'admin@techflow.io', plan: 'pro', clv: 12400, tenure: 14, successRate: 0.89 },
  { id: 'cus_003', name: 'Nova Systems', email: 'pay@nova.systems', plan: 'starter', clv: 2800, tenure: 5, successRate: 0.72 },
  { id: 'cus_004', name: 'Orbit Labs', email: 'finance@orbitlabs.com', plan: 'pro', clv: 18900, tenure: 22, successRate: 0.94 },
  { id: 'cus_005', name: 'CloudPeak', email: 'ops@cloudpeak.dev', plan: 'enterprise', clv: 61000, tenure: 48, successRate: 0.98 },
  { id: 'cus_006', name: 'DataSphere', email: 'cto@datasphere.ai', plan: 'starter', clv: 1200, tenure: 2, successRate: 0.60 },
  { id: 'cus_007', name: 'Pixel Studio', email: 'hi@pixelstudio.co', plan: 'free', clv: 0, tenure: 1, successRate: 0.45 },
  { id: 'cus_008', name: 'Meridian AI', email: 'pay@meridian.ai', plan: 'pro', clv: 9800, tenure: 11, successRate: 0.85 },
];

const RISK_REASONS = [
  'Card used from 3 different countries in 24h',
  'Transaction amount 4x above average',
  'New card added moments before charge',
  'Velocity: 8 charges in 2 hours',
  'IP address mismatch with billing country',
  'First transaction over $500',
  'Disputed charge history on file',
  'Card flagged by issuer network',
  'Unusual transaction time (3am local)',
  'Billing zip mismatch',
];

export function generateTransactions(count = 40) {
  const types = ['charge', 'refund', 'payout'];
  const statuses = ['succeeded', 'failed', 'pending'];

  return Array.from({ length: count }, (_, i) => {
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const riskScore = Math.random();
    const amount = Math.floor(Math.random() * 4800) + 50;
    const d = new Date();
    d.setMinutes(d.getMinutes() - Math.floor(Math.random() * 2880));

    return {
      id: `txn_${String(i).padStart(4, '0')}`,
      customer,
      amount,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      riskScore,
      riskReason: riskScore > 0.6 ? RISK_REASONS[Math.floor(Math.random() * RISK_REASONS.length)] : null,
      timestamp: d,
      refundStatus: null, // null | 'approved' | 'denied' | 'pending_ai'
      aiSuggestion: null,
    };
  }).sort((a, b) => b.riskScore - a.riskScore);
}