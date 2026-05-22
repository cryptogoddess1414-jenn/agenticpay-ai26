import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700',
  trial: 'bg-blue-100 text-blue-700',
  trialing: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  churned: 'bg-red-100 text-red-700',
  past_due: 'bg-orange-100 text-orange-700',
  paused: 'bg-gray-100 text-gray-600',
};

export default function AdminUsersTable({ users, subscriptions, loading }) {
  const [search, setSearch] = useState('');

  const subMap = subscriptions.reduce((acc, s) => {
    if (!acc[s.user_email]) acc[s.user_email] = s;
    return acc;
  }, {});

  const rows = users
    .filter(u =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 10);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#0A2540]">Users</h3>
          <p className="text-xs text-gray-400">{users.length} total registered</p>
        </div>
        <div className="relative w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input
            placeholder="Search users…"
            className="pl-8 h-8 text-xs"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">User</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Plan</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-right py-2 font-semibold text-gray-400 uppercase tracking-wide">MRR</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">No users found</td>
                </tr>
              ) : (
                rows.map(u => {
                  const sub = subMap[u.email];
                  const status = sub?.status ?? '—';
                  const plan = sub?.plan ?? '—';
                  const mrr = sub?.mrr ?? 0;
                  return (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#635BFF]/10 flex items-center justify-center text-[10px] font-bold text-[#635BFF]">
                            {(u.full_name || u.email || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-[#0A2540]">{u.full_name || '—'}</p>
                            <p className="text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 capitalize text-gray-600">{plan}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-500'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-semibold text-[#0A2540]">
                        {mrr > 0 ? `$${mrr}` : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}