import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlanCard({ plan, isCurrentPlan, onSelect, loading }) {
  return (
    <div className={`rounded-2xl border-2 p-6 flex flex-col transition-all ${
      isCurrentPlan
        ? 'border-[#635BFF] bg-[#635BFF]/5 shadow-lg shadow-[#635BFF]/10'
        : plan.popular
        ? 'border-[#635BFF]/30 bg-white hover:border-[#635BFF]/60'
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      {isCurrentPlan && (
        <div className="text-xs font-bold text-[#635BFF] uppercase tracking-widest mb-3">Current Plan</div>
      )}
      {!isCurrentPlan && plan.popular && (
        <div className="text-xs font-bold text-[#635BFF] uppercase tracking-widest mb-3">Most Popular</div>
      )}
      <div className="text-sm font-semibold text-[#425466] mb-1">{plan.name}</div>
      <div className="flex items-end gap-1 mb-1">
        <span className="text-3xl font-black text-[#0A2540]">${plan.amount}</span>
        <span className="text-sm text-gray-400 mb-1">/month</span>
      </div>
      <p className="text-sm text-[#425466] mb-5">{plan.description}</p>
      <ul className="space-y-2 mb-6 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm text-[#425466]">
            <Check className="w-4 h-4 text-[#635BFF] flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
      <Button
        onClick={() => onSelect(plan.key)}
        disabled={isCurrentPlan || loading}
        variant={isCurrentPlan ? 'secondary' : 'default'}
        className={isCurrentPlan ? '' : 'bg-[#635BFF] hover:bg-[#5751E8] text-white'}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
      </Button>
    </div>
  );
}