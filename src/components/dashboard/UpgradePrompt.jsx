import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UpgradePrompt({ open, onClose, featureName = 'this feature', requiredPlan = 'Starter' }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#635BFF]/10 mx-auto mb-3">
            <Lock className="w-6 h-6 text-[#635BFF]" />
          </div>
          <DialogTitle className="text-center text-[#0A2540] text-xl">
            Upgrade to unlock {featureName}
          </DialogTitle>
          <DialogDescription className="text-center text-[#425466]">
            This feature is available on the <strong>{requiredPlan}</strong> plan and above.
            Upgrade your plan to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 bg-[#F6F9FC] rounded-xl p-4 space-y-2">
          {['CSV & PDF exports', 'Advanced analytics', 'Priority support', 'Higher API limits'].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm text-[#0A2540]">
              <Zap className="w-4 h-4 text-[#635BFF] shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button asChild className="bg-[#635BFF] hover:bg-[#5751e8] w-full">
            <Link to="/billing" onClick={onClose}>
              Upgrade Now <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="ghost" className="w-full text-[#425466]" onClick={onClose}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}