import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';

function buildMonthlyRevenue(transactions) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i);
    return {
      label: format(d, 'MMM'),
      start: startOfMonth(d),
      end: endOfMonth(d),
      revenue: 0,
    };
  });

  transactions.forEach(t => {
    if (t.status !== 'succeeded' || t.type !== 'charge') return;
    const date = t.date ? parseISO(t.date) : null;
    if (!date) return;
    const bucket = months.find(m => isWithinInterval(date, { start: m.start, end: m.end }));
    if (bucket) bucket.revenue += t.amount || 0;
  });

  return months.map(m => ({ month: m.label, revenue: m.revenue }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-[#0A2540] mb-1">{label}</p>
      <p className="text-[#635BFF] font-bold">${payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function AdminRevenueChart({ transactions, loading }) {
  const data = buildMonthlyRevenue(transactions);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-[#0A2540]">Revenue (Last 6 Months)</h3>
        <p className="text-xs text-gray-400">Successful charges only</p>
      </div>
      {loading ? (
        <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#635BFF" stopOpacity={1} />
                <stop offset="100%" stopColor="#635BFF" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8898AA' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#8898AA' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="url(#barGrad)" radius={[6, 6, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}