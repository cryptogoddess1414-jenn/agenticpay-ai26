import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart2 } from 'lucide-react';

const SERIES = [
  { key: 'volume',      label: 'Volume ($)',     color: '#635BFF', type: 'area' },
  { key: 'succeeded',   label: 'Succeeded',      color: '#22c55e', type: 'bar' },
  { key: 'failed',      label: 'Failed',         color: '#ef4444', type: 'bar' },
  { key: 'successRate', label: 'Success Rate',   color: '#f59e0b', type: 'line', format: v => `${(v * 100).toFixed(1)}%` },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-[#0A2540] mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#8898AA]">{p.name}:</span>
          <span className="font-semibold text-[#0A2540]">
            {p.dataKey === 'volume' ? '$' + p.value.toLocaleString() :
             p.dataKey === 'successRate' ? `${(p.value * 100).toFixed(1)}%` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function PayoutCycleChart({ data }) {
  const [visible, setVisible] = useState({ volume: true, succeeded: true, failed: true, successRate: true });

  const toggle = key => setVisible(v => ({ ...v, [key]: !v[key] }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#635BFF]" />
          <h3 className="text-sm font-bold text-[#0A2540]">Payout Cycle Performance (30 days)</h3>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {SERIES.map(s => (
            <button key={s.key} onClick={() => toggle(s.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                visible[s.key] ? 'border-transparent text-white' : 'border-gray-200 bg-white text-[#8898AA]'
              }`}
              style={visible[s.key] ? { background: s.color } : {}}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: visible[s.key] ? 'white' : s.color }} />
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8898AA' }} tickLine={false} axisLine={false}
            interval={Math.floor(data.length / 6)} />
          <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#8898AA' }} tickLine={false} axisLine={false}
            tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#8898AA' }} tickLine={false} axisLine={false}
            tickFormatter={v => `${(v * 100).toFixed(0)}%`} domain={[0.7, 1]} />
          <Tooltip content={<CustomTooltip />} />
          {visible.volume && (
            <Area yAxisId="left" type="monotone" dataKey="volume" fill="#635BFF20" stroke="#635BFF" strokeWidth={2} dot={false} name="Volume ($)" />
          )}
          {visible.succeeded && (
            <Bar yAxisId="left" dataKey="succeeded" fill="#22c55e" opacity={0.7} name="Succeeded" radius={[2, 2, 0, 0]} />
          )}
          {visible.failed && (
            <Bar yAxisId="left" dataKey="failed" fill="#ef4444" opacity={0.7} name="Failed" radius={[2, 2, 0, 0]} />
          )}
          {visible.successRate && (
            <Line yAxisId="right" type="monotone" dataKey="successRate" stroke="#f59e0b" strokeWidth={2} dot={false} name="Success Rate" strokeDasharray="4 2" />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}