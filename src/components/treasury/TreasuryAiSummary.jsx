import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, RefreshCw, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

const SENTIMENT_CONFIG = {
  healthy:  { label: 'Healthy',  cls: 'bg-green-50 text-green-700 border-green-200' },
  caution:  { label: 'Caution',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  critical: { label: 'Critical', cls: 'bg-red-50 text-red-600 border-red-200' },
};

export default function TreasuryAiSummary({ cycles, banks, liquidity }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  const generate = async () => {
    setLoading(true);
    const recent = cycles.slice(-7);
    const totalVolume = recent.reduce((s, d) => s + d.volume, 0);
    const totalFailed = recent.reduce((s, d) => s + d.failed, 0);
    const avgSuccessRate = (recent.reduce((s, d) => s + d.successRate, 0) / recent.length * 100).toFixed(1);
    const worstBanks = [...banks].sort((a, b) => a.successRate - b.successRate).slice(0, 3);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are the AgenticPay AI treasury analyst. Provide a concise daily treasury summary for a payments platform.

Payout performance (last 7 days):
- Total payout volume: $${totalVolume.toLocaleString()}
- Failed payouts: ${totalFailed}
- Average success rate: ${avgSuccessRate}%

Liquidity position:
- Pending payouts: $${liquidity.pendingPayouts.toLocaleString()} (${liquidity.pendingCount} transactions)
- Expected inflows (24h): $${liquidity.expectedInflows.toLocaleString()}
- Reserve balance: $${liquidity.reserve.toLocaleString()}
- Coverage ratio: ${liquidity.coverage}x
- Net position: ${liquidity.netPosition >= 0 ? '+' : ''}$${liquidity.netPosition.toLocaleString()}

Problematic banks:
${worstBanks.map(b => `- ${b.name} (${b.country}): ${(b.successRate * 100).toFixed(1)}% success, ${b.failures} failures, top reason: "${b.topReason}"`).join('\n')}

Provide:
1. A headline status of the treasury health
2. Key liquidity risk (if any)
3. Top 2 bank-level failure patterns to address
4. Recommended payout schedule optimization for today
5. One specific action to take in the next 4 hours`,
      response_json_schema: {
        type: 'object',
        properties: {
          headline: { type: 'string' },
          status: { type: 'string', enum: ['healthy', 'caution', 'critical'] },
          summary: { type: 'string' },
          recommendations: { type: 'array', items: { type: 'string' } },
          optimal_payout_time: { type: 'string' },
          urgent_action: { type: 'string' },
        }
      }
    });

    setSummary(result);
    setLastRun(new Date());
    setLoading(false);
  };

  useEffect(() => { generate(); }, []);

  const statusCfg = summary ? SENTIMENT_CONFIG[summary.status] : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-[#0A2540] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#635BFF] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">AI Treasury Analysis</p>
            <p className="text-[10px] text-[#8898AA]">
              AgenticPay AI · {lastRun ? `Updated ${lastRun.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Generating…'}
            </p>
          </div>
        </div>
        <Button size="sm" variant="ghost" onClick={generate} disabled={loading}
          className="text-[#8898AA] hover:text-white hover:bg-white/10 gap-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-5/6" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <p className="text-xs text-[#8898AA] flex items-center gap-1.5 mt-2">
              <Sparkles className="w-3 h-3 text-[#635BFF]" /> Analyzing payout cycles and liquidity…
            </p>
          </div>
        ) : summary ? (
          <div className="space-y-4">
            {/* Headline + status */}
            <div className="flex items-start gap-3">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex-shrink-0 ${statusCfg?.cls}`}>
                {statusCfg?.label}
              </span>
              <p className="text-sm font-bold text-[#0A2540] leading-snug">{summary.headline}</p>
            </div>

            {/* Summary */}
            <p className="text-sm text-[#425466] leading-relaxed">{summary.summary}</p>

            {/* Optimal payout time */}
            {summary.optimal_payout_time && (
              <div className="flex items-center gap-2 bg-[#EEF0FF] rounded-xl px-4 py-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#635BFF] flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-[#635BFF] uppercase tracking-wider">Optimal Payout Window Today</p>
                  <p className="text-xs text-[#425466]">{summary.optimal_payout_time}</p>
                </div>
              </div>
            )}

            {/* Urgent action */}
            {summary.urgent_action && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">Action Required (Next 4 Hours)</p>
                  <p className="text-xs text-amber-700">{summary.urgent_action}</p>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {summary.recommendations?.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-[#8898AA] uppercase tracking-wider">Recommendations</p>
                {summary.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[#425466]">{r}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}