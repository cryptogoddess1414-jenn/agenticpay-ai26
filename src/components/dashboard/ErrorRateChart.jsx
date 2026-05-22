import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useDashboard } from './DashboardContext';

const STATUS_CODES = [
  { code: '2xx', color: '#10B981' },
  { code: '4xx', color: '#F97316' },
  { code: '5xx', color: '#EF4444' },
];

function generateStatusData(hourly) {
  return hourly.slice(-12).map(d => ({
    time: d.time,
    '2xx': d.requests - d.errors,
    '4xx': Math.floor(d.errors * 0.7),
    '5xx': Math.ceil(d.errors * 0.3),
  }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-[#0A2540] mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-[#425466]">{p.name}:</span>
          <span className="font-bold text-[#0A2540]">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function ErrorRateChart() {
  const { hourly } = useDashboard();
  const data = generateStatusData(hourly);

  const total5xx = hourly.reduce((s, d) => s + Math.ceil(d.errors * 0.3), 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-[#0A2540]">Response Codes</h3>
        <p className="text-xs text-[#8898AA]">Last 12 hours breakdown</p>
      </div>

      <div className="flex gap-3 mb-5">
        {STATUS_CODES.map(s => (
          <div key={s.code} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="text-xs text-[#425466] font-medium">{s.code}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} barSize={6} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#8898AA' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#8898AA' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="2xx" stackId="a" fill="#10B981" radius={[0,0,0,0]} />
          <Bar dataKey="4xx" stackId="a" fill="#F97316" radius={[0,0,0,0]} />
          <Bar dataKey="5xx" stackId="a" fill="#EF4444" radius={[3,3,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-[#8898AA]">5xx errors (24h)</span>
        <span className="text-sm font-bold text-red-500">{total5xx.toLocaleString()}</span>
      </div>
    </div>
  );
}