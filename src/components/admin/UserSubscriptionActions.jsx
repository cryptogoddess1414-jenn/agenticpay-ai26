import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { PauseCircle, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function UserSubscriptionActions({ activeSub, onSubUpdated }) {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus) => {
    if (!activeSub) return;
    setLoading(true);
    const updated = await base44.entities.Subscription.update(activeSub.id, { status: newStatus });
    onSubUpdated(updated);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-[#0A2540]">Subscription Actions</h3>
        <p className="text-xs text-gray-400 mt-0.5">Manage this user's subscription</p>
      </div>

      {!activeSub ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No active subscription</p>
          <p className="text-xs text-gray-400">This user has no active or paused subscription to manage.</p>
        </div>
      ) : (
        <>
          {/* Current status */}
          <div className="rounded-xl bg-gray-50 p-4 space-y-2">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Current Status</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#0A2540] capitalize">{activeSub.plan} Plan</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize
                ${activeSub.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  activeSub.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'}`}>
                {activeSub.status}
              </span>
            </div>
            <p className="text-xs text-gray-500">${activeSub.mrr ?? 0}/month</p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {activeSub.status === 'active' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm" disabled={loading}>
                    <PauseCircle className="w-4 h-4 text-yellow-500" />
                    Pause Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Pause Subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will pause the user's subscription. They will lose access to paid features but their subscription won't be fully cancelled.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => updateStatus('paused')} className="bg-yellow-500 hover:bg-yellow-600">
                      Pause
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {activeSub.status === 'paused' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm" disabled={loading}>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Resume Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Resume Subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reactivate the user's subscription and restore their paid access.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => updateStatus('active')} className="bg-emerald-600 hover:bg-emerald-700">
                      Resume
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {(activeSub.status === 'active' || activeSub.status === 'paused' || activeSub.status === 'trial' || activeSub.status === 'trialing') && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2 text-sm text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" disabled={loading}>
                    <XCircle className="w-4 h-4 text-red-500" />
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently cancel the user's subscription. This action cannot be undone. The user will lose all paid features immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction onClick={() => updateStatus('cancelled')} className="bg-red-600 hover:bg-red-700">
                      Cancel Subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <p className="text-[10px] text-gray-300 text-center pt-2">
            Changes take effect immediately.
          </p>
        </>
      )}
    </div>
  );
}