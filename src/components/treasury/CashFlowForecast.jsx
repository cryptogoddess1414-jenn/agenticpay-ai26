import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Legend
} from 'recharts';
import { TrendingUp, Sliders, Info } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

// Derive baseline stats from 30-day historical cycles
function getBaseline(cycles) {
  const avgVolume    = cycles.reduce((s, d) => s + d.volume, 0) / cycles.length;
  const avgSuccessRate = cycles.reduce((s, d) => s + d.successRate, 0) / cycles.length;
  const avgPayouts   = cycles.reduce((s, d) => s + d.payouts, 0) / cycles.length;
  const avgFailed    = cycles.reduce((s, d) => s + d.failed, 0) / cycles.length;
  // Simple linear trend: slope of volume over last 30 days
  const n = cycles.length;
  const sumX = (n * (n - 1)) / 2;
  const sumXY = cycles.reduce((s, d, i) => s + i * d.volume, 0);
  const sumX2 = cycles.reduce((s, _, i) => s + i * i, 0);
  const slope = (n * sumXY - sumX * avgVolume * n) / (n * sumX2 - sumX * sumX);
  return { avgVolume, avgSuccessRate, avgPayouts, avgFailed, slope };
}

// Project 30 days forward given scenario parameters
function project({ baseline, growthRate, churnReduction, failureImprovement, days = 30 }) {
  const { avgVolume, avgSuccessRate, slope } = baseline;
  const effectiveGrowth = growthRate / 100;         // e.g. 0.05
  const churnFactor     = 1 - churnReduction / 100; // reduces churn drag
  const failFactor      = 1 - failureImprovement / 100;

  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const label = d.toLocaleDateString([], { month: 'short', day: 'numeric' });

    // Base trend + growth uplift + churn drag reduction
    const trendVolume = avgVolume + slope * (30 + i);
    const growth      = trendVolume * (1 + effectiveGrowth * ((i + 1) / days));
    const volume      = Math.round(growth * churnFactor * 1.05); // churn reduction lifts volume
    const successRate = Math.min(0.999, avgSuccessRate + (1 - avgSuccessRate) * failureImprovement / 100);
    const payouts     = Math.round(baseline.avgPayouts * (1 + effectiveGrowth * 0.5));
    const failed      = Math.round(baseline.avgFailed * failFactor);
    const inflow      = volume;
    const payout      = Math.round(volume * 0.72); // payouts ≈ 72% of inflow
    const netCashFlow = inflow - payout;

    return { date: label, inflow, payout, netCashFlow, volume, successRate, failed };
  });
}

const SCENARIOS = [
  { id: 'base',       label: 'Base Case',    growth: 3,  churn: 5,  failure: 5,  color: '#635BFF' },
  { id: 'optimistic', label: 'Optimistic',   growth: 12, churn: 20, failure: 15, color: '#22c55e' },
  { id: 'pessimistic',label: 'Pessimistic',  growth: -2, churn: 0,  failure: 0,  color: '#ef4444' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs min-w-[180px]">
      <p className="font-bold text-[#0A2540] mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey + p.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-[#8898AA] truncate">{p.name}</span>
          </div>
          <span className="font-semibold text-[#0A2540]">
            {p.dataKey.includes('Rate')
              ? `${(p.value * 100).toFixed(1)}%`
              : `$${p.value.toLocaleString()}`}
          </span>
        </div>
      ))}
    </div>
  );
};

function ScenarioLine({ baseline, scenario, metric, yAxisId }) {
  const data = useMemo(() => project({
    baseline,
    growthRate: scenario.growth,
    churnReduction: scenario.churn,
    failureImprovement: scenario.failure,
  }), [baseline, scenario]);

  return (
    <Line
      yAxisId={yAxisId}
      data={data}
      type="monotone"
      dataKey={metric}
      stroke={scenario.color}
      strokeWidth={2}
      dot={false}
      name={scenario.label}
      strokeDasharray={scenario.id === 'base' ? '0' : scenario.id === 'optimistic' ? '0' : '4 2'}
    />
  );
}

export default function CashFlowForecast({ cycles }) {
  const baseline = useMemo(() => getBaseline(cycles), [cycles]);

  // Custom scenario sliders
  const [growth, setGrowth]   = useState(5);
  const [churn, setChurn]     = useState(10);
  const [failure, setFailure] = useState(10);
  const [metric, setMetric]   = useState('netCashFlow');
  const [visibleScenarios, setVisibleScenarios] = useState(['base', 'optimistic', 'pessimistic', 'custom']);

  const customData = useMemo(() => project({
    baseline, growthRate: growth, churnReduction: churn, failureImprovement: failure,
  }), [baseline, growth, churn, failure]);

  // Merge all scenario data by index for the combined chart
  const chartData = useMemo(() => {
    const base    = project({ baseline, growthRate: 3,  churnReduction: 5,  failureImprovement: 5  });
    const opti    = project({ baseline, growthRate: 12, churnReduction: 20, failureImprovement: 15 });
    const pessi   = project({ baseline, growthRate: -2, churnReduction: 0,  failureImprovement: 0  });

    return base.map((d, i) => ({
      date: d.date,
      base:        base[i][metric],
      optimistic:  opti[i][metric],
      pessimistic: pessi[i][metric],
      custom:      customData[i][metric],
    }));
  }, [baseline, metric, customData]);

  // Summary numbers for custom scenario (30d totals)
  const summary = useMemo(() => ({
    totalInflow:   customData.reduce((s, d) => s + d.inflow, 0),
    totalPayout:   customData.reduce((s, d) => s + d.payout, 0),
    totalNet:      customData.reduce((s, d) => s + d.netCashFlow, 0),
    avgSuccessRate: (customData.reduce((s, d) => s + d.successRate, 0) / customData.length * 100).toFixed(1),
  }), [customData]);

  const toggleScenario = (id) =>
    setVisibleScenarios(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const METRIC_OPTS = [
    { key: 'netCashFlow', label: 'Net Cash Flow' },
    { key: 'inflow',      label: 'Inflows' },
    { key: 'payout',      label: 'Payouts' },
    { key: 'successRate', label: 'Success Rate' },
  ];

  const SCENARIO_COLORS = { base: '#635BFF', optimistic: '#22c55e', pessimistic: '#ef4444', custom: '#f59e0b' };
  const SCENARIO_LABELS = { base: 'Base Case', optimistic: 'Optimistic', pessimistic: 'Pessimistic', custom: 'Custom' };

  return (
    <div className="space-y-6">

      {/* Summary stats for custom scenario */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: '30d Projected Inflow',  value: `$${(summary.totalInflow / 1000).toFixed(0)}k`,  sub: 'Expected receipts' },
          { label: '30d Projected Payouts', value: `$${(summary.totalPayout / 1000).toFixed(0)}k`,  sub: 'Outgoing payouts' },
          { label: '30d Net Cash Flow',     value: `$${(summary.totalNet / 1000).toFixed(0)}k`,     sub: summary.totalNet >= 0 ? 'Surplus' : 'Shortfall', warn: summary.totalNet < 0 },
          { label: 'Avg Success Rate',      value: `${summary.avgSuccessRate}%`, sub: 'Projected payout success' },
        ].map((c, i) => (
          <div key={c.label} className={`rounded-xl p-4 border ${c.warn ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'} shadow-sm`}>
            <p className="text-[10px] font-bold text-[#8898AA] uppercase tracking-wider mb-1">{c.label}</p>
            <p className={`text-xl font-black tabular-nums ${c.warn ? 'text-red-500' : 'text-[#0A2540]'}`}>{c.value}</p>
            <p className="text-[10px] text-[#8898AA] mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Main chart card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#635BFF]" />
            <h3 className="text-sm font-bold text-[#0A2540]">30-Day What-If Scenarios</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Metric selector */}
            <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
              {METRIC_OPTS.map(m => (
                <button key={m.key} onClick={() => setMetric(m.key)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all whitespace-nowrap ${
                    metric === m.key ? 'bg-white text-[#635BFF] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}>{m.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Scenario toggles */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.entries(SCENARIO_LABELS).map(([id, label]) => {
            const active = visibleScenarios.includes(id);
            return (
              <button key={id} onClick={() => toggleScenario(id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  active ? 'text-white border-transparent' : 'border-gray-200 bg-white text-[#8898AA]'
                }`}
                style={active ? { background: SCENARIO_COLORS[id] } : {}}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? 'white' : SCENARIO_COLORS[id] }} />
                {label}
              </button>
            );
          })}
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8898AA' }} tickLine={false} axisLine={false}
              interval={Math.floor(chartData.length / 6)} />
            <YAxis tick={{ fontSize: 10, fill: '#8898AA' }} tickLine={false} axisLine={false}
              tickFormatter={v => metric === 'successRate' ? `${(v * 100).toFixed(0)}%` : v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#e5e7eb" strokeDasharray="3 3" />
            {visibleScenarios.includes('base') && (
              <Line type="monotone" dataKey="base" stroke="#635BFF" strokeWidth={2} dot={false} name="Base Case" />
            )}
            {visibleScenarios.includes('optimistic') && (
              <Line type="monotone" dataKey="optimistic" stroke="#22c55e" strokeWidth={2} dot={false} name="Optimistic" />
            )}
            {visibleScenarios.includes('pessimistic') && (
              <Line type="monotone" dataKey="pessimistic" stroke="#ef4444" strokeWidth={2} dot={false} name="Pessimistic" strokeDasharray="4 2" />
            )}
            {visibleScenarios.includes('custom') && (
              <Area type="monotone" dataKey="custom" stroke="#f59e0b" strokeWidth={2.5} fill="#f59e0b15" dot={false} name="Custom" />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Custom scenario sliders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Sliders className="w-4 h-4 text-[#f59e0b]" />
          <h3 className="text-sm font-bold text-[#0A2540]">Custom Scenario Parameters</h3>
          <span className="text-[10px] text-[#8898AA] ml-1">— adjust sliders to update the amber forecast line in real-time</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Growth rate */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#425466]">Subscription Growth Rate</p>
              <span className={`text-sm font-black tabular-nums ${growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {growth >= 0 ? '+' : ''}{growth}%
              </span>
            </div>
            <Slider min={-10} max={25} step={1} value={[growth]}
              onValueChange={([v]) => setGrowth(v)}
              className="mb-2" />
            <div className="flex justify-between text-[10px] text-[#8898AA]">
              <span>-10% decline</span><span>+25% growth</span>
            </div>
            <p className="text-[10px] text-[#8898AA] mt-2">
              Projected MRR impact: <strong className="text-[#0A2540]">{growth >= 0 ? '+' : ''}{(growth * 0.85).toFixed(1)}%</strong>
            </p>
          </div>

          {/* Churn reduction */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#425466]">Churn Reduction Effort</p>
              <span className="text-sm font-black text-[#635BFF] tabular-nums">{churn}%</span>
            </div>
            <Slider min={0} max={40} step={1} value={[churn]}
              onValueChange={([v]) => setChurn(v)}
              className="mb-2" />
            <div className="flex justify-between text-[10px] text-[#8898AA]">
              <span>No effort</span><span>40% reduction</span>
            </div>
            <p className="text-[10px] text-[#8898AA] mt-2">
              Retained subscribers: <strong className="text-[#0A2540]">~{Math.round(churn * 2.4)} additional</strong>
            </p>
          </div>

          {/* Failure improvement */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#425466]">Payout Failure Improvement</p>
              <span className="text-sm font-black text-emerald-600 tabular-nums">{failure}%</span>
            </div>
            <Slider min={0} max={50} step={1} value={[failure]}
              onValueChange={([v]) => setFailure(v)}
              className="mb-2" />
            <div className="flex justify-between text-[10px] text-[#8898AA]">
              <span>No change</span><span>50% fewer failures</span>
            </div>
            <p className="text-[10px] text-[#8898AA] mt-2">
              Projected success rate: <strong className="text-[#0A2540]">
                {Math.min(99.9, (summary.avgSuccessRate * 1 + failure * 0.1)).toFixed(1)}%
              </strong>
            </p>
          </div>
        </div>

        {/* Scenario comparison table */}
        <div className="mt-6 border-t border-gray-100 pt-5">
          <p className="text-[10px] font-bold text-[#8898AA] uppercase tracking-wider mb-3">30-Day Scenario Comparison</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-2 text-[#8898AA] font-semibold">Scenario</th>
                  <th className="text-right pb-2 text-[#8898AA] font-semibold">Inflow</th>
                  <th className="text-right pb-2 text-[#8898AA] font-semibold">Payouts</th>
                  <th className="text-right pb-2 text-[#8898AA] font-semibold">Net Cash Flow</th>
                  <th className="text-right pb-2 text-[#8898AA] font-semibold">vs. Base</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { id: 'pessimistic', label: 'Pessimistic',  growth: -2,   churn: 0,    failure: 0    },
                  { id: 'base',        label: 'Base Case',    growth: 3,    churn: 5,    failure: 5    },
                  { id: 'custom',      label: 'Custom ★',     growth,       churn,       failure       },
                  { id: 'optimistic',  label: 'Optimistic',   growth: 12,   churn: 20,   failure: 15   },
                ].map(s => {
                  const data = project({ baseline, growthRate: s.growth, churnReduction: s.churn, failureImprovement: s.failure });
                  const inflow  = data.reduce((acc, d) => acc + d.inflow, 0);
                  const payout  = data.reduce((acc, d) => acc + d.payout, 0);
                  const net     = data.reduce((acc, d) => acc + d.netCashFlow, 0);
                  const base    = project({ baseline, growthRate: 3, churnReduction: 5, failureImprovement: 5 });
                  const baseNet = base.reduce((acc, d) => acc + d.netCashFlow, 0);
                  const diff    = net - baseNet;
                  return (
                    <tr key={s.id} className={s.id === 'custom' ? 'bg-amber-50/40' : ''}>
                      <td className="py-2 font-semibold" style={{ color: SCENARIO_COLORS[s.id] }}>{s.label}</td>
                      <td className="py-2 text-right text-[#425466]">${(inflow / 1000).toFixed(0)}k</td>
                      <td className="py-2 text-right text-[#425466]">${(payout / 1000).toFixed(0)}k</td>
                      <td className={`py-2 text-right font-bold ${net >= 0 ? 'text-green-600' : 'text-red-500'}`}>${(net / 1000).toFixed(0)}k</td>
                      <td className={`py-2 text-right font-bold ${s.id === 'base' ? 'text-[#8898AA]' : diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {s.id === 'base' ? '—' : `${diff >= 0 ? '+' : ''}$${(diff / 1000).toFixed(0)}k`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}