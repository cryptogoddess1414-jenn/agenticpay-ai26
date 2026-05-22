import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowDownCircle, ArrowUpCircle, Layers, Clock, TrendingUp } from 'lucide-react';

function fmt(n) { return '$' + n.toLocaleString(); }

export default function LiquidityPanel({ liquidity }) {
  const { pendingPayouts, expectedInflows, reserve, netPosition, coverage, nextPayoutWindow, pendingCount } = liquidity;
  const positive = netPosition >= 0;

  const cards = [
    { icon: ArrowDownCircle, label: 'Pending Payouts',   value: fmt(pendingPayouts),  sub: `${pendingCount} transactions`, color: 'text-red-500 bg-red-50' },
    { icon: ArrowUpCircle,   label: 'Expected Inflows',  value: fmt(expectedInflows), sub: 'Next 24 hours',                color: 'text-green-600 bg-green-50' },
    { icon: Layers,          label: 'Reserve Balance',   value: fmt(reserve),         sub: 'Liquid reserves',              color: 'text-[#635BFF] bg-[#EEF0FF]' },
    { icon: TrendingUp,      label: 'Net Position',      value: fmt(Math.abs(netPosition)), sub: positive ? 'Surplus' : 'Shortfall', color: positive ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#635BFF]" />
          <h3 className="text-sm font-bold text-[#0A2540]">Daily Liquidity Summary</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#8898AA] bg-gray-50 px-3 py-1.5 rounded-lg">
          <Clock className="w-3 h-3" />
          Next payout window: <strong className="text-[#0A2540] ml-1">{nextPayoutWindow}</strong>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-xl bg-gray-50 border border-gray-100 p-4">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2.5 ${c.color}`}>
              <c.icon className="w-3.5 h-3.5" />
            </div>
            <p className="text-[10px] font-bold text-[#8898AA] uppercase tracking-wider mb-1">{c.label}</p>
            <p className="text-lg font-black text-[#0A2540] tabular-nums">{c.value}</p>
            <p className="text-[10px] text-[#8898AA] mt-0.5">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Coverage bar */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[#425466]">Payout Coverage Ratio</p>
          <p className={`text-sm font-black ${parseFloat(coverage) >= 1.2 ? 'text-green-600' : parseFloat(coverage) >= 1 ? 'text-amber-500' : 'text-red-500'}`}>{coverage}x</p>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(parseFloat(coverage) / 2 * 100, 100)}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`h-full rounded-full ${parseFloat(coverage) >= 1.2 ? 'bg-green-500' : parseFloat(coverage) >= 1 ? 'bg-amber-400' : 'bg-red-500'}`} />
        </div>
        <p className="text-[10px] text-[#8898AA] mt-1.5">(Inflows + Reserve) ÷ Pending Payouts — target ≥ 1.2x</p>
      </div>
    </div>
  );
}