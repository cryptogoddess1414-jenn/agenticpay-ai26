import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { Users, Zap, TrendingUp, MousePointerClick } from 'lucide-react';

const COLORS = ['#635BFF', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-[#0A2540]">{payload[0].name || payload[0].payload.name}</p>
      <p className="text-[#635BFF]">{payload[0].value} events</p>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xl font-extrabold text-[#0A2540]">{value}</p>
    </div>
  </div>
);

export default function FeatureUsageTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.FeatureEvent.list('-created_date', 500).then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const { featureCounts, actionCounts, topUsers, recentEvents } = useMemo(() => {
    const featureMap = {};
    const actionMap = {};
    const userMap = {};

    events.forEach(e => {
      featureMap[e.feature] = (featureMap[e.feature] || 0) + 1;
      actionMap[e.action] = (actionMap[e.action] || 0) + 1;
      userMap[e.user_email] = (userMap[e.user_email] || 0) + 1;
    });

    const featureCounts = Object.entries(featureMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const actionCounts = Object.entries(actionMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const topUsers = Object.entries(userMap)
      .map(([email, count]) => ({ email, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentEvents = events.slice(0, 10);

    return { featureCounts, actionCounts, topUsers, recentEvents };
  }, [events]);

  const uniqueUsers = useMemo(() => new Set(events.map(e => e.user_email)).size, [events]);

  if (loading) {
    return (
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Zap className="w-10 h-10 text-gray-200 mb-3" />
        <p className="text-sm font-semibold text-gray-400">No feature events yet</p>
        <p className="text-xs text-gray-300 mt-1">Events will appear here as users interact with tracked features.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="Total Events" value={events.length.toLocaleString()} color="bg-[#635BFF]" />
        <StatCard icon={Users} label="Unique Users" value={uniqueUsers} color="bg-[#0EA5E9]" />
        <StatCard icon={TrendingUp} label="Features Tracked" value={featureCounts.length} color="bg-emerald-500" />
        <StatCard icon={MousePointerClick} label="Action Types" value={actionCounts.length} color="bg-amber-500" />
      </div>

      {/* Feature Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-[#0A2540] mb-1">Events by Feature</h3>
        <p className="text-xs text-gray-400 mb-5">Most interacted features across all users</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={featureCounts} layout="vertical" margin={{ left: 16, right: 16 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#425466' }} axisLine={false} tickLine={false} width={120} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f9fb' }} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24}>
              {featureCounts.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions Pie */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-[#0A2540] mb-1">Actions Breakdown</h3>
          <p className="text-xs text-gray-400 mb-4">Distribution of tracked action types</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={actionCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} paddingAngle={3}>
                {actionCounts.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-bold text-[#0A2540] mb-1">Most Active Users</h3>
          <p className="text-xs text-gray-400 mb-4">Users with the most tracked events</p>
          <div className="space-y-3">
            {topUsers.map((u, i) => {
              const pct = Math.round((u.count / topUsers[0].count) * 100);
              return (
                <div key={u.email}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#0A2540] font-medium truncate max-w-[200px]">{u.email}</span>
                    <span className="text-gray-400 ml-2 flex-shrink-0">{u.count} events</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-[#0A2540] mb-4">Recent Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">User</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Feature</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Action</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Page</th>
                <th className="text-left py-2 font-semibold text-gray-400 uppercase tracking-wide">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map(e => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 pr-4 text-[#0A2540] font-medium truncate max-w-[160px]">{e.user_email}</td>
                  <td className="py-2.5 pr-4">
                    <span className="bg-[#635BFF]/10 text-[#635BFF] px-2 py-0.5 rounded-full font-semibold">{e.feature}</span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{e.action}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-400">{e.page || '—'}</td>
                  <td className="py-2.5 text-gray-400">
                    {new Date(e.created_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}