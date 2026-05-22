import React from 'react';
import { format } from 'date-fns';

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700',
  trial: 'bg-blue-100 text-blue-700',
  trialing: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  churned: 'bg-red-100 text-red-700',
  past_due: 'bg-orange-100 text-orange-700',
  paused: 'bg-yellow-100 text-yellow-700',
};

const PLAN_COLORS = {
  free: 'text-gray-500',
  starter: 'text-blue-600',
  pro: 'text-[#635BFF]',
  enterprise: 'text-emerald-600',
};

export default function UserSubscriptionHistory({ subscriptions }) {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-[#0A2540] mb-4">Subscription History</h3>
        <p className="text-xs text-gray-400 text-center py-6">No subscriptions found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-bold text-[#0A2540] mb-4">Subscription History</h3>
      <div className="space-y-3">
        {subscriptions.map((s, i) => (
          <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            {/* Timeline dot */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={`w-2.5 h-2.5 rounded-full ${s.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              {i < subscriptions.length - 1 && <div className="w-px h-4 bg-gray-200" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-sm font-semibold capitalize ${PLAN_COLORS[s.plan] || 'text-gray-700'}`}>
                  {s.plan} plan
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-500'}`}>
                  {s.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                {s.signup_date && (
                  <span>Started {format(new Date(s.signup_date), 'MMM d, yyyy')}</span>
                )}
                {s.churn_date && (
                  <span>· Ended {format(new Date(s.churn_date), 'MMM d, yyyy')}</span>
                )}
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-[#0A2540]">${s.mrr ?? 0}<span className="text-xs font-normal text-gray-400">/mo</span></p>
              {s.country && <p className="text-xs text-gray-400">{s.country}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}