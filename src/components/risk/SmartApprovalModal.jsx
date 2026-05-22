import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle2, XCircle, Loader2, User, CreditCard, ShieldAlert, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VERDICT_CONFIG = {
  approve: { label: 'Approve Refund',  cls: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle2 },
  deny:    { label: 'Deny Refund',     cls: 'text-red-600 bg-red-50 border-red-200',       icon: XCircle },
  review:  { label: 'Manual Review',   cls: 'text-amber-600 bg-amber-50 border-amber-200', icon: ShieldAlert },
};

export default function SmartApprovalModal({ transaction, onClose, onDecision }) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!transaction) return;
    analyze();
  }, [transaction]);

  const analyze = async () => {
    setLoading(true);
    setAnalysis(null);
    const { customer, amount, riskScore, riskReason, type } = transaction;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are the AgenticPay AI risk engine. Evaluate whether to approve or deny a ${type} request of $${amount}.

Customer profile:
- Name: ${customer.name}
- Plan: ${customer.plan}
- Customer Lifetime Value (CLV): $${customer.clv.toLocaleString()}
- Account tenure: ${customer.tenure} months
- Historical payment success rate: ${(customer.successRate * 100).toFixed(0)}%

Transaction details:
- Amount: $${amount}
- Risk score: ${(riskScore * 100).toFixed(0)}/100
- Risk flag: ${riskReason || 'None'}

Make a smart refund decision. High-CLV, long-tenure customers should generally be approved even at medium risk. New accounts or high-risk flags with low CLV should be denied or sent for manual review.`,
      response_json_schema: {
        type: 'object',
        properties: {
          verdict: { type: 'string', enum: ['approve', 'deny', 'review'] },
          confidence: { type: 'number' },
          reasoning: { type: 'string' },
          clv_impact: { type: 'string' },
          recommended_action: { type: 'string' },
        }
      }
    });

    setAnalysis(result);
    setLoading(false);
  };

  if (!transaction) return null;
  const { customer, amount, riskScore, riskReason } = transaction;
  const txId = transaction.id;
  const verdictCfg = analysis ? VERDICT_CONFIG[analysis.verdict] : null;
  const VerdictIcon = verdictCfg?.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10">

          {/* Modal header */}
          <div className="bg-[#0A2540] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#635BFF] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Smart Approval</p>
                <p className="text-[10px] text-[#8898AA]">AgenticPay AI · {txId}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-[#8898AA] hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Transaction summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <CreditCard className="w-3 h-3 text-[#8898AA]" />
                  <p className="text-[10px] text-[#8898AA] font-semibold uppercase tracking-wider">Amount</p>
                </div>
                <p className="text-xl font-black text-[#0A2540]">${amount.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-3 h-3 text-[#8898AA]" />
                  <p className="text-[10px] text-[#8898AA] font-semibold uppercase tracking-wider">Risk Score</p>
                </div>
                <p className={`text-xl font-black ${riskScore >= 0.7 ? 'text-red-500' : riskScore >= 0.4 ? 'text-amber-500' : 'text-green-600'}`}>
                  {(riskScore * 100).toFixed(0)}/100
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <User className="w-3 h-3 text-[#8898AA]" />
                  <p className="text-[10px] text-[#8898AA] font-semibold uppercase tracking-wider">Customer</p>
                </div>
                <p className="text-sm font-bold text-[#0A2540]">{customer.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-[#8898AA]">CLV: <strong className="text-[#0A2540]">${customer.clv.toLocaleString()}</strong></span>
                  <span className="text-[11px] text-[#8898AA]">Tenure: <strong className="text-[#0A2540]">{customer.tenure}mo</strong></span>
                  <span className="text-[11px] text-[#8898AA]">Plan: <strong className="text-[#635BFF] capitalize">{customer.plan}</strong></span>
                </div>
              </div>
            </div>

            {riskReason && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{riskReason}</p>
              </div>
            )}

            {/* AI Analysis */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-2 border-b border-gray-100">
                <Sparkles className="w-3.5 h-3.5 text-[#635BFF]" />
                <p className="text-xs font-bold text-[#0A2540]">AI Analysis</p>
              </div>
              <div className="px-4 py-4">
                {loading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="flex items-center gap-2 mt-3">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#635BFF]" />
                      <p className="text-xs text-[#8898AA]">AgenticPay AI is evaluating this refund…</p>
                    </div>
                  </div>
                ) : analysis ? (
                  <div className="space-y-3">
                    {/* Verdict badge */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${verdictCfg?.cls}`}>
                      {VerdictIcon && <VerdictIcon className="w-3.5 h-3.5" />}
                      {verdictCfg?.label}
                      <span className="opacity-60 font-normal">· {Math.round(analysis.confidence * 100)}% confidence</span>
                    </div>
                    <p className="text-sm text-[#425466] leading-relaxed">{analysis.reasoning}</p>
                    {analysis.clv_impact && (
                      <div className="bg-[#EEF0FF] rounded-lg px-3 py-2">
                        <p className="text-[11px] font-semibold text-[#635BFF]">CLV Impact</p>
                        <p className="text-xs text-[#425466] mt-0.5">{analysis.clv_impact}</p>
                      </div>
                    )}
                    {analysis.recommended_action && (
                      <p className="text-[11px] text-[#8898AA]">
                        <strong className="text-[#0A2540]">Recommended: </strong>{analysis.recommended_action}
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Action buttons */}
            {!loading && analysis && (
              <div className="flex gap-2 pt-1">
                <Button onClick={() => onDecision(transaction.id, 'approved')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </Button>
                <Button onClick={() => onDecision(transaction.id, 'denied')} variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 gap-1.5">
                  <XCircle className="w-4 h-4" /> Deny
                </Button>
                <Button onClick={onClose} variant="ghost" className="px-3 text-gray-400">
                  Skip
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}