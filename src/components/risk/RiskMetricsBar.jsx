import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, RefreshCw, TrendingDown } from 'lucide-react';

export default function RiskMetricsBar({ transactions }) {
  const high   = transactions.filter(t => t.riskScore >= 0.7).length;
  const medium = transactions.filter(t => t.riskScore >= 0.4 && t.riskScore < 0.7).length;
  const clean  = transactions.filter(t => t.riskScore < 0.4).length;
  const refundReqs = transactions.filter(t => t.type === 'refund').length;

  const cards = [
    { icon: AlertTriangle, label: 'High Risk', value: high,       sub: 'Require review',      color: 'bg-red-50 text-red-500' },
    { icon: TrendingDown,  label: 'Medium Risk', value: medium,   sub: 'Monitor closely',     color: 'bg-amber-50 text-amber-500' },
    { icon: ShieldCheck,   label: 'Clean',       value: clean,    sub: 'Low risk transactions', color: 'bg-green-50 text-green-600' },
    { icon: RefreshCw,     label: 'Refund Requests', value: refundReqs, sub: 'Pending decisions', color: 'bg-[#EEF0FF] text-[#635BFF]' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div key={c.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.07 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-[#8898AA] uppercase tracking-wider">{c.label}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.color}`}>
              <c.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A2540] tabular-nums">{c.value}</div>
          <div className="text-xs text-[#8898AA] mt-1">{c.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}