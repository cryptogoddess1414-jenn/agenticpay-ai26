import React from 'react';
import { Users, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color, loading }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      {loading ? (
        <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-[#0A2540]">{value}</p>
      )}
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

export default function AdminStatCards({ subscriptions, transactions, users, loading }) {
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const mrr = activeSubscriptions.reduce((sum, s) => sum + (s.mrr || 0), 0);
  const churned = subscriptions.filter(s => s.status === 'churned' || s.status === 'cancelled');
  const failedTxns = transactions.filter(t => t.status === 'failed');

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: users.length.toLocaleString(),
      sub: `${subscriptions.filter(s => s.status === 'trial').length} on trial`,
      color: 'bg-[#635BFF]',
    },
    {
      icon: CreditCard,
      label: 'Active Subscriptions',
      value: activeSubscriptions.length.toLocaleString(),
      sub: `of ${subscriptions.length} total`,
      color: 'bg-emerald-500',
    },
    {
      icon: TrendingUp,
      label: 'Monthly Recurring Revenue',
      value: `$${mrr.toLocaleString()}`,
      sub: `across ${activeSubscriptions.length} active subs`,
      color: 'bg-blue-500',
    },
    {
      icon: AlertCircle,
      label: 'Churned / Failed',
      value: churned.length.toLocaleString(),
      sub: `${failedTxns.length} failed transactions`,
      color: 'bg-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(s => <StatCard key={s.label} {...s} loading={loading} />)}
    </div>
  );
}