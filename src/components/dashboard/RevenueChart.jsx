import React, { useState } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useDashboard } from './DashboardContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-[#0A2540] mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color ?? p.fill }} />
          <span className="text-[#425466]">{p.name}:</span>
          <span className="font-bold text-[#0A2540]">${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function RevenueChart() {
  const { revenue } = useDashboard();
  const [view, setView] = useState('daily');

  const last14 = revenue.slice(-14);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-[#0A2540]">Revenue</h3>
          <p className="text-xs text-[#8898AA]">Daily revenue & MRR trend</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          {['daily', 'mrr'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors capitalize ${
                view === v ? 'bg-white text-[#0A2540] shadow-sm' : 'text-[#8898AA] hover:text-[#425466]'
              }`}
            >
              {v === 'daily' ? 'Daily' : 'MRR'}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={last14} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#635BFF" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#635BFF" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8898AA' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#8898AA' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: '#8898AA', paddingTop: 8 }} iconType="circle" iconSize={8} />
          {view === 'daily' ? (
            <>
              <Bar dataKey="daily" name="Daily Revenue" fill="url(#gradRevenue)" radius={[4, 4, 0, 0]} barSize={16} />
              <Line
                type="monotone"
                dataKey="cumulative"
                name="Cumulative"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </>
          ) : (
            <Line
              type="monotone"
              dataKey="mrr"
              name="MRR"
              stroke="#635BFF"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}