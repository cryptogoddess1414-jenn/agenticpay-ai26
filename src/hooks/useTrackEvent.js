import { useCallback } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Returns a `track(feature, action, metadata?)` function.
 * Fire-and-forget — errors are silently swallowed so tracking never breaks the UI.
 *
 * Usage:
 *   const track = useTrackEvent('dashboard');
 *   track('revenue_chart', 'viewed');
 *   track('export_pdf', 'clicked', { plan: 'pro' });
 */
export default function useTrackEvent(page = '') {
  return useCallback(
    async (feature, action, metadata) => {
      try {
        await base44.functions.invoke('trackEvent', { feature, action, page, metadata });
      } catch (_) {
        // silently ignore tracking failures
      }
    },
    [page]
  );
}