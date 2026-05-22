import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import PlanCard from '../components/billing/PlanCard';
import CurrentPlanBanner from '../components/billing/CurrentPlanBanner';
import InvoicesList from '../components/billing/InvoicesList';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    amount: 29,
    description: 'Perfect for individuals and small teams getting started.',
    features: ['Up to 1,000 API calls/day', 'Core payments', 'Email support', 'Basic analytics'],
  },
  {
    key: 'pro',
    name: 'Pro',
    amount: 79,
    popular: true,
    description: 'For growing businesses that need more power and flexibility.',
    features: ['Up to 50,000 API calls/day', 'Advanced payments', 'Priority support', 'Full analytics', 'Webhooks'],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    amount: 199,
    description: 'For large organizations with custom needs.',
    features: ['Unlimited API calls', 'Dedicated account manager', '24/7 phone support', 'SLA guarantee', 'Custom integrations', 'SSO'],
  },
];

export default function Billing() {
  const [billingData, setBillingData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [managingPortal, setManagingPortal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success')) toast.success('Subscription activated! Welcome aboard.');
    if (params.get('cancelled')) toast.info('Checkout cancelled.');
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    setLoading(true);
    const [subRes, invRes] = await Promise.all([
      base44.functions.invoke('billing', { action: 'get_subscription' }),
      base44.functions.invoke('billing', { action: 'get_invoices' }),
    ]);
    setBillingData(subRes.data);
    setInvoices(invRes.data?.invoices || []);
    setLoading(false);
  };

  const handleSelectPlan = async (planKey) => {
    // Block if inside iframe
    if (window.self !== window.top) {
      alert('Checkout is only available from the published app, not the preview.');
      return;
    }
    setCheckoutLoading(planKey);
    const res = await base44.functions.invoke('billing', { action: 'create_checkout', planKey });
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      toast.error('Could not start checkout. Please try again.');
    }
    setCheckoutLoading(null);
  };

  const handleManagePortal = async () => {
    if (window.self !== window.top) {
      alert('Billing portal is only available from the published app, not the preview.');
      return;
    }
    setManagingPortal(true);
    const res = await base44.functions.invoke('billing', { action: 'create_portal' });
    if (res.data?.url) window.location.href = res.data.url;
    setManagingPortal(false);
  };

  const currentPlanName = billingData?.subscription?.items?.data[0]?.price?.product?.name?.toLowerCase();

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-[960px] mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#635BFF] flex items-center justify-center">
              <CreditCard className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0A2540]">Billing & Plans</h1>
              <p className="text-sm text-gray-400">Manage your subscription and payment methods</p>
            </div>
          </div>

          {/* Current Plan */}
          {loading ? (
            <div className="h-20 bg-white rounded-2xl border border-gray-200 animate-pulse mb-6" />
          ) : (
            <div className="mb-6">
              <CurrentPlanBanner
                subscription={billingData?.subscription}
                onManage={handleManagePortal}
                managingPortal={managingPortal}
              />
            </div>
          )}

          {/* Plans */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-[#0A2540] mb-4">Available Plans</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-2xl border border-gray-200 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map(plan => (
                  <PlanCard
                    key={plan.key}
                    plan={plan}
                    isCurrentPlan={currentPlanName === plan.key}
                    onSelect={handleSelectPlan}
                    loading={checkoutLoading === plan.key}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Invoices */}
          {loading ? (
            <div className="h-40 bg-white rounded-2xl border border-gray-200 animate-pulse" />
          ) : (
            <InvoicesList invoices={invoices} />
          )}
        </div>
      </div>
    </div>
  );
}