import { api } from '@/services/api';
import type { LinkAnalytics } from '@/types/analytics';

export async function getLinkAnalyticsRequest(linkId: string): Promise<LinkAnalytics> {
  const { data } = await api.get<{ data: LinkAnalytics }>(`/analytics/${linkId}`);
  return data.data;
}

export async function exportClickHistoryCsvRequest(linkId: string): Promise<Blob> {
  const { data } = await api.get<Blob>(`/analytics/${linkId}/export`, { responseType: 'blob' });
  return data;
}
