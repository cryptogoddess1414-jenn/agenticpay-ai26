import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AdminStatCards from '../components/admin/AdminStatCards';
import AdminRevenueChart from '../components/admin/AdminRevenueChart';
import AdminPlanChart from '../components/admin/AdminPlanChart';
import AdminUsersTable from '../components/admin/AdminUsersTable';
import AdminActivityFeed from '../components/admin/AdminActivityFeed';
import MrrForecastChart from '../components/admin/MrrForecastChart';
import { LayoutDashboard, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    const [subs, txns, usrs] = await Promise.all([
      base44.entities.Subscription.list('-created_date', 200),
      base44.entities.Transaction.list('-created_date', 200),
      base44.entities.User.list('-created_date', 100),
    ]);
    setSubscriptions(subs);
    setTransactions(txns);
    setUsers(usrs);
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#0A2540]">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Stat Cards */}
        <AdminStatCards subscriptions={subscriptions} transactions={transactions} users={users} loading={loading} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdminRevenueChart transactions={transactions} loading={loading} />
          </div>
          <div>
            <AdminPlanChart subscriptions={subscriptions} loading={loading} />
          </div>
        </div>

        {/* MRR Forecast */}
        <MrrForecastChart subscriptions={subscriptions} transactions={transactions} loading={loading} />

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdminUsersTable users={users} subscriptions={subscriptions} loading={loading} />
          </div>
          <div>
            <AdminActivityFeed transactions={transactions} subscriptions={subscriptions} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}