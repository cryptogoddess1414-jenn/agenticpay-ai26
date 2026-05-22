import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CreditCard, DollarSign, AlertCircle } from 'lucide-react';

export default function AnalyticsMetrics({ metrics }) {
  const cards = [
    {
      icon: DollarSign,
      label: 'Weekly Revenue',
      value: `$${metrics.weekRevenue.toLocaleString()}`,
      sub: 'Last 7 days',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: CreditCard,
      label: 'Transactions',
      value: metrics.weekTransactions.toLocaleString(),
      sub: 'Last 7 days',
      color: 'bg-[#EEF0FF] text-[#635BFF]',
    },
    {
      icon: TrendingUp,
      label: 'Current MRR',
      value: `$${metrics.currentMrr.toLocaleString()}`,
      sub: 'Monthly recurring',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: AlertCircle,
      label: 'Churn Risk',
      value: metrics.highRisk,
      sub: 'High-risk subscribers',
      color: 'bg-red-50 text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8898AA] uppercase tracking-wider">{c.label}</span>
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