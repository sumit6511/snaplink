import { api } from '@/services/api';
import type { LinkAnalytics } from '@/types/analytics';

export async function getLinkAnalyticsRequest(linkId: string): Promise<LinkAnalytics> {
  const { data } = await api.get<{ data: LinkAnalytics }>(`/analytics/${linkId}`);
  return data.data;
}
