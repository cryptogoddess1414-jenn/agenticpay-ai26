// Treasury mock data generators

export const BANKS = [
  { id: 'boa', name: 'Bank of America', country: 'US', successRate: 0.97, avgLatency: 1.2 },
  { id: 'chase', name: 'JPMorgan Chase', country: 'US', successRate: 0.98, avgLatency: 0.9 },
  { id: 'wells', name: 'Wells Fargo', country: 'US', successRate: 0.94, avgLatency: 1.8 },
  { id: 'hsbc', name: 'HSBC', country: 'UK', successRate: 0.91, avgLatency: 2.4 },
  { id: 'barclays', name: 'Barclays', country: 'UK', successRate: 0.89, avgLatency: 2.8 },
  { id: 'deutsche', name: 'Deutsche Bank', country: 'DE', successRate: 0.92, avgLatency: 2.1 },
  { id: 'bnp', name: 'BNP Paribas', country: 'FR', successRate: 0.88, avgLatency: 3.1 },
  { id: 'citi', name: 'Citibank', country: 'US', successRate: 0.96, avgLatency: 1.4 },
];

const FAILURE_REASONS = [
  'Insufficient funds at settlement window',
  'Bank maintenance window overlap',
  'Routing number validation failure',
  'Weekend processing delay',
  'Cross-border compliance hold',
  'ACH cutoff time missed',
  'Beneficiary account closed',
  'Duplicate transaction rejected',
];

export function generatePayoutCycles(days = 30) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const volume = Math.floor(Math.random() * 180000) + 40000;
    const payouts = Math.floor(Math.random() * 120) + 20;
    const failed = Math.floor(Math.random() * 8);
    const pending = Math.floor(Math.random() * 15);
    return {
      date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      volume,
      payouts,
      failed,
      pending,
      succeeded: payouts - failed - pending,
      successRate: ((payouts - failed) / payouts),
    };
  });
}

export function generateBankFailures() {
  return BANKS.map(bank => ({
    ...bank,
    failures: Math.floor(Math.random() * 18) + 1,
    totalPayouts: Math.floor(Math.random() * 200) + 50,
    lastFailure: (() => {
      const d = new Date();
      d.setHours(d.getHours() - Math.floor(Math.random() * 72));
      return d;
    })(),
    topReason: FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)],
    optimalWindow: ['09:00–11:00 EST', '14:00–16:00 EST', '10:00–12:00 GMT', '08:00–10:00 CET'][Math.floor(Math.random() * 4)],
  }));
}

export function generateLiquiditySummary() {
  const pendingPayouts = Math.floor(Math.random() * 320000) + 80000;
  const expectedInflows = Math.floor(Math.random() * 450000) + 120000;
  const reserve = Math.floor(Math.random() * 200000) + 50000;
  return {
    pendingPayouts,
    expectedInflows,
    reserve,
    netPosition: expectedInflows - pendingPayouts,
    coverage: ((expectedInflows + reserve) / pendingPayouts).toFixed(2),
    nextPayoutWindow: '14:00–16:00 EST',
    pendingCount: Math.floor(Math.random() * 80) + 20,
  };
}