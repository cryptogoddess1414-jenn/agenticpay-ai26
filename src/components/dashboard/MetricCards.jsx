import React from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { useDashboard } from './DashboardContext';

function Card({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#8898AA] uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-black text-[#0A2540] tabular-nums">{value}</div>
      <div className="text-xs text-[#8898AA] mt-1">{sub}</div>
    </motion.div>
  );
}

export default function MetricCards() {
  const { totals } = useDashboard();

  const cards = [
    {
      icon: Zap,
      label: 'Total Requests',
      value: totals.requests.toLocaleString(),
      sub: 'Last 24 hours',
      color: 'bg-[#EEF0FF] text-[#635BFF]',
    },
    {
      icon: AlertTriangle,
      label: 'Total Errors',
      value: totals.errors.toLocaleString(),
      sub: `${((totals.errors / totals.requests) * 100).toFixed(2)}% error rate`,
      color: 'bg-red-50 text-red-500',
    },
    {
      icon: Clock,
      label: 'Avg Latency',
      value: `${totals.avgLatency}ms`,
      sub: 'p50 across all endpoints',
      color: 'bg-amber-50 text-amber-500',
    },
    {
      icon: DollarSign,
      label: 'Cumulative Revenue',
      value: `$${(totals.revenue / 1000).toFixed(1)}K`,
      sub: 'All time',
      color: 'bg-green-50 text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <Card key={c.label} {...c} delay={i * 0.07} />
      ))}
    </div>
  );
}