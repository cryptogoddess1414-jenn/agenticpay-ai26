import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import AiSummaryCard from '../components/analytics/AiSummaryCard';
import PaymentTrendsChart from '../components/analytics/PaymentTrendsChart';
import ChurnPredictionPanel from '../components/analytics/ChurnPredictionPanel';
import AnalyticsMetrics from '../components/analytics/AnalyticsMetrics';
import AiChatSidebar from '../components/chat/AiChatSidebar';
import AiChatButton from '../components/chat/AiChatButton';
import { BarChart2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

function generatePaymentData(days = 30) {
  let base = 18000;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const daily = Math.floor(Math.random() * 3500) + 800;
    base += daily * 0.4;
    return {
      date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      revenue: daily,
      transactions: Math.floor(Math.random() * 140) + 20,
      refunds: Math.floor(Math.random() * 12),
      mrr: Math.floor(base / 30),
    };
  });
}

function generateChurnData(subs = 120) {
  const plans = ['free', 'starter', 'pro', 'enterprise'];
  return Array.from({ length: subs }, (_, i) => ({
    id: `sub_${i}`,
    plan: plans[Math.floor(Math.random() * plans.length)],
    mrr: Math.floor(Math.random() * 500) + 10,
    daysActive: Math.floor(Math.random() * 365) + 1,
    lastApiCall: Math.floor(Math.random() * 30),  // days ago
    failedPayments: Math.floor(Math.random() * 4),
    churnScore: Math.random(),
  })).sort((a, b) => b.churnScore - a.churnScore);
}

export default function Analytics() {
  const [chatOpen, setChatOpen] = useState(false);
  const [paymentData] = useState(() => generatePaymentData());
  const [churnData] = useState(() => generateChurnData());
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  const generateSummary = async () => {
    setSummaryLoading(true);
    const recent = paymentData.slice(-7);
    const totalRevenue = recent.reduce((s, d) => s + d.revenue, 0);
    const totalTx = recent.reduce((s, d) => s + d.transactions, 0);
    const totalRefunds = recent.reduce((s, d) => s + d.refunds, 0);
    const avgMrr = Math.round(recent.reduce((s, d) => s + d.mrr, 0) / recent.length);
    const highRiskCount = churnData.filter(s => s.churnScore > 0.7).length;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are the AgenticPay AI financial analyst. Generate a concise, insightful weekly financial performance summary for a payments SaaS platform based on the following data:

- Total revenue this week: $${totalRevenue.toLocaleString()}
- Total transactions: ${totalTx}
- Total refunds: ${totalRefunds} (refund rate: ${((totalRefunds / totalTx) * 100).toFixed(1)}%)
- Average MRR: $${avgMrr.toLocaleString()}
- High churn-risk subscribers: ${highRiskCount} out of ${churnData.length}

Daily breakdown (last 7 days):
${recent.map(d => `  ${d.date}: $${d.revenue.toLocaleString()} revenue, ${d.transactions} transactions`).join('\n')}

Write 3-4 sentences in a professional but direct tone. Highlight the most important trend, one risk to watch, and one actionable recommendation. Start with a strong opener sentence about overall performance.`,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          headline: { type: 'string' },
          sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
          key_metrics: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                value: { type: 'string' },
                trend: { type: 'string', enum: ['up', 'down', 'flat'] },
              }
            }
          }
        }
      }
    });

    setSummary(result);
    setLastGenerated(new Date());
    setSummaryLoading(false);
  };

  useEffect(() => { generateSummary(); }, []);

  const metrics = {
    weekRevenue: paymentData.slice(-7).reduce((s, d) => s + d.revenue, 0),
    weekTransactions: paymentData.slice(-7).reduce((s, d) => s + d.transactions, 0),
    currentMrr: paymentData[paymentData.length - 1]?.mrr ?? 0,
    highRisk: churnData.filter(s => s.churnScore > 0.7).length,
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-[1200px] mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center">
                  <BarChart2 className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-extrabold text-[#0A2540] tracking-tight">AI Analytics</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#635BFF]/10 border border-[#635BFF]/20 text-[#635BFF] uppercase tracking-wider">Powered by AgenticPay AI</span>
              </div>
              <p className="text-sm text-[#8898AA] ml-[42px]">
                Payment trends, churn predictions, and AI-generated financial summaries.
              </p>
            </div>
            <Button
              onClick={generateSummary}
              disabled={summaryLoading}
              variant="outline"
              className="flex items-center gap-2 border-[#635BFF]/30 text-[#635BFF] hover:bg-[#635BFF]/5"
            >
              <RefreshCw className={`w-4 h-4 ${summaryLoading ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>

          {/* Metric cards */}
          <AnalyticsMetrics metrics={metrics} />

          {/* AI Summary */}
          <div className="mt-6">
            <AiSummaryCard summary={summary} loading={summaryLoading} lastGenerated={lastGenerated} />
          </div>

          {/* Charts row */}
          <div className="mt-6">
            <PaymentTrendsChart data={paymentData} />
          </div>

          {/* Churn prediction */}
          <div className="mt-6">
            <ChurnPredictionPanel subscribers={churnData} />
          </div>

        </div>
        <AiChatButton onClick={() => setChatOpen(true)} />
        <AiChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </div>
  );
}