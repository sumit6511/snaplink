import { useQuery } from '@tanstack/react-query';
import { getLinkAnalyticsRequest } from '@/services/analytics.service';

export function useLinkAnalytics(linkId: string | undefined) {
  return useQuery({
    queryKey: ['analytics', linkId],
    queryFn: () => getLinkAnalyticsRequest(linkId!),
    enabled: Boolean(linkId),
  });
}
