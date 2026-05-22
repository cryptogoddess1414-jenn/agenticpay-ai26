import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Mail, Calendar, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import UserSubscriptionHistory from '../components/admin/UserSubscriptionHistory';
import UserInvoicesTable from '../components/admin/UserInvoicesTable';
import UserSubscriptionActions from '../components/admin/UserSubscriptionActions';

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700',
  trial: 'bg-blue-100 text-blue-700',
  trialing: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  churned: 'bg-red-100 text-red-700',
  past_due: 'bg-orange-100 text-orange-700',
  paused: 'bg-gray-100 text-gray-600',
};

export default function AdminUserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [allUsers, allSubs, allTxns] = await Promise.all([
      base44.entities.User.list(),
      base44.entities.Subscription.list('-created_date', 200),
      base44.entities.Transaction.list('-created_date', 200),
    ]);
    const foundUser = allUsers.find(u => u.id === userId);
    setUser(foundUser || null);
    if (foundUser) {
      setSubscriptions(allSubs.filter(s => s.user_email === foundUser.email));
      setTransactions(allTxns.filter(t => t.user_email === foundUser.email));
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [userId]);

  const activeSub = subscriptions.find(s => s.status === 'active' || s.status === 'trial' || s.status === 'trialing' || s.status === 'paused');

  const handleSubUpdated = (updated) => {
    setSubscriptions(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#635BFF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">User not found.</p>
        <Link to="/admin"><Button variant="outline">Back to Admin</Button></Link>
      </div>
    );
  }

  const joinedDate = user.created_date ? format(new Date(user.created_date), 'MMM d, yyyy') : '—';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500">
                <ArrowLeft className="w-4 h-4" /> Admin
              </Button>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-[#0A2540]">{user.full_name || user.email}</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#635BFF]/10 flex items-center justify-center text-2xl font-bold text-[#635BFF] flex-shrink-0">
              {(user.full_name || user.email || '?')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-[#0A2540]">{user.full_name || '—'}</h2>
                {activeSub && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[activeSub.status] || 'bg-gray-100 text-gray-500'}`}>
                    {activeSub.status}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{user.email}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />Role: {user.role || 'user'}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Joined {joinedDate}</span>
              </div>
            </div>
            {/* Quick stats */}
            <div className="flex gap-4 sm:gap-6 flex-shrink-0">
              <div className="text-center">
                <p className="text-xl font-bold text-[#0A2540]">{subscriptions.length}</p>
                <p className="text-xs text-gray-400">Subscriptions</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#0A2540]">{transactions.length}</p>
                <p className="text-xs text-gray-400">Invoices</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#0A2540]">
                  ${transactions.filter(t => t.status === 'succeeded').reduce((s, t) => s + (t.amount || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">Total Paid</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UserSubscriptionHistory subscriptions={subscriptions} />
            <UserInvoicesTable transactions={transactions} />
          </div>
          <div>
            <UserSubscriptionActions
              activeSub={activeSub}
              onSubUpdated={handleSubUpdated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}