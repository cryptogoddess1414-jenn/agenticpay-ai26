import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldAlert, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RISK_LABEL = {
  high:   { label: 'High',   cls: 'bg-red-50 text-red-600 border-red-100' },
  medium: { label: 'Medium', cls: 'bg-amber-50 text-amber-600 border-amber-100' },
  low:    { label: 'Low',    cls: 'bg-green-50 text-green-700 border-green-100' },
};

const STATUS_ICON = {
  approved: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
  denied:   <XCircle className="w-3.5 h-3.5 text-red-500" />,
  pending_ai: <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />,
};

function getRiskLevel(score) {
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}

export default function TransactionRiskTable({ transactions, onSmartApprove }) {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filtered = transactions.filter(t => {
    if (filter === 'high') return t.riskScore >= 0.7;
    if (filter === 'refunds') return t.type === 'refund';
    if (filter === 'pending') return !t.refundStatus && t.type === 'refund';
    return true;
  });

  const displayed = showAll ? filtered : filtered.slice(0, 12);

  const filterTabs = [
    { key: 'all',     label: `All (${transactions.length})` },
    { key: 'high',    label: `High Risk (${transactions.filter(t => t.riskScore >= 0.7).length})` },
    { key: 'refunds', label: `Refunds (${transactions.filter(t => t.type === 'refund').length})` },
    { key: 'pending', label: `Pending (${transactions.filter(t => !t.refundStatus && t.type === 'refund').length})` },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#635BFF]" />
          <h3 className="text-sm font-bold text-[#0A2540]">Transaction Risk Monitor</h3>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5 overflow-x-auto">
          {filterTabs.map(f => (
            <button key={f.key} onClick={() => { setFilter(f.key); setShowAll(false); }}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md whitespace-nowrap transition-all ${
                filter === f.key ? 'bg-white text-[#635BFF] shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="text-left px-6 py-3 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider">Transaction</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider hidden sm:table-cell">Customer</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider hidden md:table-cell">Risk</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider hidden lg:table-cell">CLV</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider hidden md:table-cell">Flag</th>
              <th className="text-right px-6 py-3 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayed.map((t, i) => {
              const level = getRiskLevel(t.riskScore);
              const cfg = RISK_LABEL[level];
              return (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#0A2540]">{t.id}</p>
                      <p className="text-[10px] text-[#8898AA] capitalize">{t.type} · {t.status}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <p className="text-xs font-medium text-[#0A2540]">{t.customer.name}</p>
                    <p className="text-[10px] text-[#8898AA] capitalize">{t.customer.plan}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-bold text-[#0A2540]">${t.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                      {cfg.label} · {(t.riskScore * 100).toFixed(0)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <p className="text-xs font-medium text-[#425466]">${t.customer.clv.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell max-w-[180px]">
                    {t.riskReason ? (
                      <p className="text-[10px] text-red-500 truncate" title={t.riskReason}>{t.riskReason}</p>
                    ) : (
                      <p className="text-[10px] text-green-500">No flags</p>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {t.refundStatus ? (
                      <div className="flex items-center justify-end gap-1.5">
                        {STATUS_ICON[t.refundStatus]}
                        <span className={`text-[10px] font-bold capitalize ${
                          t.refundStatus === 'approved' ? 'text-green-600' :
                          t.refundStatus === 'denied' ? 'text-red-500' : 'text-amber-500'
                        }`}>{t.refundStatus.replace('_', ' ')}</span>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => onSmartApprove(t)}
                        className="gap-1.5 bg-[#635BFF] hover:bg-[#5751e8] text-white text-[11px] h-7 px-2.5">
                        <Sparkles className="w-3 h-3" />
                        Smart Approve
                      </Button>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length > 12 && (
        <div className="px-6 py-3 border-t border-gray-50">
          <button onClick={() => setShowAll(v => !v)}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#635BFF] hover:text-[#5751e8] py-1.5 rounded-lg hover:bg-[#635BFF]/5 transition-colors">
            {showAll ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> Show all {filtered.length} transactions</>}
          </button>
        </div>
      )}
    </div>
  );
}