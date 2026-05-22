import React from 'react';
import { CreditCard, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700',
  trialing: 'bg-blue-100 text-blue-700',
  past_due: 'bg-orange-100 text-orange-700',
  canceled: 'bg-red-100 text-red-700',
  paused: 'bg-gray-100 text-gray-600',
};

export default function CurrentPlanBanner({ subscription, onManage, managingPortal }) {
  if (!subscription) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0A2540]">No active subscription</p>
          <p className="text-xs text-gray-400 mt-0.5">Choose a plan below to get started</p>
        </div>
        <Badge className="bg-gray-100 text-gray-500">Free</Badge>
      </div>
    );
  }

  const planName = subscription.items?.data[0]?.price?.product?.name || 'Plan';
  const status = subscription.status;
  const amount = (subscription.items?.data[0]?.price?.unit_amount || 0) / 100;
  const interval = subscription.items?.data[0]?.price?.recurring?.interval || 'month';
  const renewDate = new Date(subscription.current_period_end * 1000).toLocaleDateString();
  const pm = subscription.default_payment_method;
  const cardBrand = pm?.card?.brand;
  const cardLast4 = pm?.card?.last4;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-[#635BFF]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-base font-bold text-[#0A2540]">{planName}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-500'}`}>
                {status}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              ${amount}/{interval} · Renews {renewDate}
              {cardLast4 && (
                <span className="ml-2">
                  · <CreditCard className="w-3.5 h-3.5 inline mb-0.5" /> {cardBrand} ····{cardLast4}
                </span>
              )}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onManage} disabled={managingPortal} className="flex items-center gap-2">
          {managingPortal ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
          Manage Billing
        </Button>
      </div>
    </div>
  );
}