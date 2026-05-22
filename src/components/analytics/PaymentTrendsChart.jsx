import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const VIEWS = ['Revenue', 'Transactions', 'MRR'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0A2540] border border-white/10 rounded-xl px-3 py-2.5 shadow-xl">
      <p className="text-[11px] text-[#8898AA] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-bold" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.name.toLowerCase().includes('rev') || p.name === 'MRR'
            ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function PaymentTrendsChart({ data }) {
  const [view, setView] = useState('Revenue');
  const [range, setRange] = useState(30);

  const sliced = data.slice(-range);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#635BFF]" />
          <h3 className="text-sm font-bold text-[#0A2540]">Payment Trends</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Range toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {[7, 14, 30].map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${range === r ? 'bg-white text-[#0A2540] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                {r}d
              </button>
            ))}
          </div>
          {/* Metric toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {VIEWS.map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${view === v ? 'bg-white text-[#635BFF] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        {view === 'Transactions' ? (
          <BarChart data={sliced} barSize={range > 14 ? 6 : 12}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8898AA' }} tickLine={false} axisLine={false}
              interval={range > 14 ? Math.floor(range / 7) : 0} />
            <YAxis tick={{ fontSize: 10, fill: '#8898AA' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="transactions" name="Transactions" fill="#635BFF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="refunds" name="Refunds" fill="#F87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <AreaChart data={sliced}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#635BFF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8898AA' }} tickLine={false} axisLine={false}
              interval={range > 14 ? Math.floor(range / 7) : 0} />
            <YAxis tick={{ fontSize: 10, fill: '#8898AA' }} tickLine={false} axisLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            {view === 'Revenue' ? (
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#635BFF" strokeWidth={2}
                fill="url(#revenueGrad)" dot={false} />
            ) : (
              <Area type="monotone" dataKey="mrr" name="MRR" stroke="#059669" strokeWidth={2}
                fill="url(#mrrGrad)" dot={false} />
            )}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}