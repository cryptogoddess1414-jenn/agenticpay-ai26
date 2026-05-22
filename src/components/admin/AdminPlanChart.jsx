import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PLAN_COLORS = {
  free: '#CBD5E1',
  starter: '#60A5FA',
  pro: '#635BFF',
  enterprise: '#10B981',
};

export default function AdminPlanChart({ subscriptions, loading }) {
  const counts = subscriptions.reduce((acc, s) => {
    const plan = s.plan || 'free';
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([plan, value]) => ({
    name: plan.charAt(0).toUpperCase() + plan.slice(1),
    value,
    color: PLAN_COLORS[plan] || '#94A3B8',
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#0A2540]">Plan Distribution</h3>
        <p className="text-xs text-gray-400">All subscriptions</p>
      </div>
      {loading ? (
        <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{ borderRadius: 12, fontSize: 12, border: '1px solid #F0F4F8' }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: '#425466' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}