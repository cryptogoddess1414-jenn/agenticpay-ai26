import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useDashboard } from './DashboardContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-[#0A2540] mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#425466]">{p.name}:</span>
          <span className="font-bold text-[#0A2540]">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function ApiUsageChart() {
  const { hourly } = useDashboard();
  const ticks = hourly.filter((_, i) => i % 4 === 0).map(d => d.time);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-[#0A2540]">API Requests</h3>
          <p className="text-xs text-[#8898AA]">Requests & latency over the last 24h</p>
        </div>
        <span className="text-xs font-semibold text-[#635BFF] bg-[#EEF0FF] px-2 py-1 rounded-full">24h</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={hourly} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gradRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#635BFF" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradLatency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" vertical={false} />
          <XAxis
            dataKey="time"
            ticks={ticks}
            tick={{ fontSize: 11, fill: '#8898AA' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: '#8898AA' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: '#8898AA' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}ms`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#8898AA', paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="requests"
            name="Requests"
            stroke="#635BFF"
            strokeWidth={2}
            fill="url(#gradRequests)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="latency"
            name="Latency (ms)"
            stroke="#F97316"
            strokeWidth={2}
            fill="url(#gradLatency)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}