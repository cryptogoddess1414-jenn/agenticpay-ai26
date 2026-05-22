import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatMonth(date) {
  return `${MONTHS[date.getMonth()]} '${String(date.getFullYear()).slice(2)}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-[#0A2540] mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-gray-600">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="capitalize">{p.name}:</span>
          <span className="font-semibold text-[#0A2540]">${p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function MrrForecastChart({ subscriptions, transactions, loading }) {
  const data = useMemo(() => {
    if (!subscriptions.length && !transactions.length) return [];

    const now = new Date();

    // --- Historical MRR: last 4 months from active subscriptions ---
    const historicalMonths = 4;
    const histPoints = [];
    for (let i = historicalMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = formatMonth(d);
      // Sum MRR of subscriptions active at that point (signed up before end of that month)
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const mrr = subscriptions
        .filter(s =>
          s.status === 'active' &&
          s.mrr > 0 &&
          new Date(s.signup_date || s.created_date) <= endOfMonth
        )
        .reduce((sum, s) => sum + (s.mrr || 0), 0);
      histPoints.push({ label, actual: Math.round(mrr), month: d });
    }

    // --- Growth rate from historical data ---
    const mrrValues = histPoints.map(p => p.actual).filter(v => v > 0);
    let growthRate = 0.05; // default 5%
    if (mrrValues.length >= 2) {
      const first = mrrValues[0];
      const last = mrrValues[mrrValues.length - 1];
      if (first > 0) {
        growthRate = Math.max(0, Math.min(0.3, (last - first) / first / (mrrValues.length - 1)));
      }
    }

    // --- Trial-to-paid conversion ---
    const trials = subscriptions.filter(s => s.status === 'trial').length;
    const totalConverted = subscriptions.filter(s => s.status === 'active' && s.mrr > 0).length;
    const totalTrialEver = totalConverted + trials;
    const conversionRate = totalTrialEver > 0 ? totalConverted / totalTrialEver : 0.25;
    const avgMrrPerUser = totalConverted > 0
      ? subscriptions.filter(s => s.status === 'active' && s.mrr > 0).reduce((s, sub) => s + sub.mrr, 0) / totalConverted
      : 50;
    const trialBoost = trials * conversionRate * avgMrrPerUser;

    // --- Forecast: next 6 months ---
    const currentMrr = histPoints[histPoints.length - 1]?.actual || 0;
    const forecastPoints = [];
    for (let i = 1; i <= 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const label = formatMonth(d);
      const base = currentMrr * Math.pow(1 + growthRate, i);
      // Trials convert gradually over first 3 months
      const trialContrib = i <= 3 ? (trialBoost * i) / 3 : trialBoost;
      const optimistic = Math.round(base * 1.15 + trialContrib);
      const conservative = Math.round(base * 0.9 + trialContrib * 0.6);
      const forecast = Math.round(base + trialContrib * 0.8);
      forecastPoints.push({ label, forecast, optimistic, conservative, month: d });
    }

    // Merge: last historical point is the "today" anchor
    const anchor = histPoints[histPoints.length - 1];
    return [
      ...histPoints.slice(0, -1).map(p => ({ label: p.label, actual: p.actual })),
      { label: anchor.label, actual: anchor.actual, forecast: anchor.actual, optimistic: anchor.actual, conservative: anchor.actual },
      ...forecastPoints.map(p => ({ label: p.label, forecast: p.forecast, optimistic: p.optimistic, conservative: p.conservative })),
    ];
  }, [subscriptions, transactions]);

  const todayLabel = formatMonth(new Date());

  const conversionRate = useMemo(() => {
    const trials = subscriptions.filter(s => s.status === 'trial').length;
    const active = subscriptions.filter(s => s.status === 'active' && s.mrr > 0).length;
    const total = trials + active;
    return total > 0 ? Math.round((active / total) * 100) : 0;
  }, [subscriptions]);

  const growthRate = useMemo(() => {
    const mrrValues = data.filter(d => d.actual > 0).map(d => d.actual);
    if (mrrValues.length < 2) return 0;
    const g = (mrrValues[mrrValues.length - 1] - mrrValues[0]) / mrrValues[0] / (mrrValues.length - 1);
    return Math.round(Math.max(0, g) * 100);
  }, [data]);

  const projected6mo = data.find(d => !d.actual && d.forecast)
    ? data.filter(d => d.forecast).at(-1)?.forecast
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#635BFF]/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#635BFF]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0A2540]">MRR Forecast</h3>
            <p className="text-xs text-gray-400 mt-0.5">Historical + 6-month projection</p>
          </div>
        </div>
        {/* KPI pills */}
        <div className="flex gap-3">
          <div className="text-center px-3 py-1.5 rounded-lg bg-[#635BFF]/8 border border-[#635BFF]/15">
            <p className="text-[10px] text-[#635BFF] font-medium uppercase tracking-wide">Growth/mo</p>
            <p className="text-sm font-bold text-[#635BFF]">{growthRate}%</p>
          </div>
          <div className="text-center px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
            <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wide">Trial → Paid</p>
            <p className="text-sm font-bold text-emerald-600">{conversionRate}%</p>
          </div>
          {projected6mo && (
            <div className="text-center px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">In 6 Months</p>
              <p className="text-sm font-bold text-[#0A2540]">${projected6mo.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#635BFF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                formatter={(v) => <span className="text-gray-500 capitalize">{v}</span>}
              />
              <ReferenceLine x={todayLabel} stroke="#E5E7EB" strokeDasharray="4 4" label={{ value: 'Today', fontSize: 10, fill: '#9CA3AF', position: 'top' }} />
              <Line dataKey="actual" stroke="#0A2540" strokeWidth={2.5} dot={{ r: 3, fill: '#0A2540' }} connectNulls activeDot={{ r: 5 }} name="actual" />
              <Line dataKey="forecast" stroke="url(#forecastGrad)" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 3, fill: '#635BFF' }} connectNulls activeDot={{ r: 5 }} name="forecast" />
              <Line dataKey="optimistic" stroke="#10B981" strokeWidth={1.5} strokeDasharray="3 4" dot={false} connectNulls activeDot={{ r: 4 }} name="optimistic" />
              <Line dataKey="conservative" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="3 4" dot={false} connectNulls activeDot={{ r: 4 }} name="conservative" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-gray-400 mt-2 text-center">
            Forecast based on {growthRate}%/mo growth trend · optimistic (+15%) and conservative (−10%) bands · trial conversions included
          </p>
        </>
      )}
    </div>
  );
}