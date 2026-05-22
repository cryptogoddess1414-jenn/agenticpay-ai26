import React from 'react';
import { CreditCard, UserPlus, XCircle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

function buildActivities(transactions, subscriptions) {
  const activities = [];

  transactions.slice(0, 10).forEach(t => {
    const isSuccess = t.status === 'succeeded';
    activities.push({
      id: `txn-${t.id}`,
      icon: isSuccess ? CheckCircle : XCircle,
      color: isSuccess ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50',
      title: isSuccess ? `Payment received` : `Payment failed`,
      sub: `${t.user_email} · $${t.amount}`,
      date: t.date || t.created_date,
    });
  });

  subscriptions.slice(0, 8).forEach(s => {
    if (s.status === 'churned' || s.status === 'cancelled') {
      activities.push({
        id: `churn-${s.id}`,
        icon: XCircle,
        color: 'text-rose-500 bg-rose-50',
        title: `Subscription cancelled`,
        sub: `${s.user_email} · ${s.plan}`,
        date: s.churn_date || s.updated_date || s.created_date,
      });
    } else if (s.status === 'trial' || s.status === 'trialing') {
      activities.push({
        id: `trial-${s.id}`,
        icon: UserPlus,
        color: 'text-blue-500 bg-blue-50',
        title: `New trial started`,
        sub: `${s.user_email} · ${s.plan}`,
        date: s.signup_date || s.created_date,
      });
    }
  });

  // Sort by date descending
  activities.sort((a, b) => {
    const da = a.date ? new Date(a.date) : 0;
    const db = b.date ? new Date(b.date) : 0;
    return db - da;
  });

  return activities.slice(0, 12);
}

export default function AdminActivityFeed({ transactions, subscriptions, loading }) {
  const activities = buildActivities(transactions, subscriptions);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#0A2540]">Recent Activity</h3>
        <p className="text-xs text-gray-400">Latest system events</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-8">No activity yet</p>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
          {activities.map(a => {
            const Icon = a.icon;
            const timeAgo = a.date
              ? formatDistanceToNow(new Date(a.date), { addSuffix: true })
              : '';
            return (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${a.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#0A2540] truncate">{a.title}</p>
                  <p className="text-[11px] text-gray-400 truncate">{a.sub}</p>
                  {timeAgo && <p className="text-[10px] text-gray-300 mt-0.5">{timeAgo}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}