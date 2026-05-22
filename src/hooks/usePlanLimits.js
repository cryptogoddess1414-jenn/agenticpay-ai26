import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

// Define what each plan is allowed to do
const PLAN_LIMITS = {
  free: {
    canExport: false,
    canAccessAdvancedAnalytics: false,
    apiCallsPerDay: 1000,
    label: 'Free',
  },
  starter: {
    canExport: true,
    canAccessAdvancedAnalytics: false,
    apiCallsPerDay: 10000,
    label: 'Starter',
  },
  pro: {
    canExport: true,
    canAccessAdvancedAnalytics: true,
    apiCallsPerDay: 100000,
    label: 'Pro',
  },
  enterprise: {
    canExport: true,
    canAccessAdvancedAnalytics: true,
    apiCallsPerDay: Infinity,
    label: 'Enterprise',
  },
};

export function usePlanLimits() {
  const [plan, setPlan] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    const res = await base44.functions.invoke('billing', { action: 'get_subscription' });
    const sub = res.data?.subscription;

    if (!sub || sub.status !== 'active') {
      setPlan('free');
    } else {
      // Derive plan key from the subscription's price product metadata or nickname
      const item = sub.items?.data?.[0];
      const productName = item?.price?.product?.name?.toLowerCase() || '';
      if (productName.includes('enterprise')) setPlan('enterprise');
      else if (productName.includes('pro')) setPlan('pro');
      else if (productName.includes('starter')) setPlan('starter');
      else setPlan('free');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  const can = (action) => {
    if (loading) return false;
    return !!limits[action];
  };

  return { plan, limits, loading, can, refetch: fetchPlan };
}