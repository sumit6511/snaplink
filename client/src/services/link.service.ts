import { api } from '@/services/api';
import type { Link, LinkStats, Pagination } from '@/types/link';

export interface ListLinksParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function listLinksRequest(
  params: ListLinksParams = {},
): Promise<{ links: Link[]; pagination: Pagination }> {
  const { data } = await api.get<{ data: { links: Link[]; pagination: Pagination } }>('/links', {
    params,
  });
  return data.data;
}

export async function getLinkStatsRequest(): Promise<LinkStats> {
  const { data } = await api.get<{ data: LinkStats }>('/links/stats/summary');
  return data.data;
}

export interface CreateLinkInput {
  originalUrl: string;
  customAlias?: string;
  title?: string;
  expiresAt?: string;
}

export async function createLinkRequest(input: CreateLinkInput): Promise<Link> {
  const { data } = await api.post<{ data: { link: Link } }>('/links', input);
  return data.data.link;
}

export async function getLinkRequest(id: string): Promise<Link> {
  const { data } = await api.get<{ data: { link: Link } }>(`/links/${id}`);
  return data.data.link;
}

export interface UpdateLinkInput {
  originalUrl?: string;
  customAlias?: string | null;
  title?: string | null;
  expiresAt?: string | null;
}

export async function updateLinkRequest(id: string, input: UpdateLinkInput): Promise<Link> {
  const { data } = await api.put<{ data: { link: Link } }>(`/links/${id}`, input);
  return data.data.link;
}

export async function deleteLinkRequest(id: string): Promise<void> {
  await api.delete(`/links/${id}`);
}

export async function exportLinksCsvRequest(search?: string): Promise<Blob> {
  const { data } = await api.get<Blob>('/links/export', {
    params: search ? { search } : undefined,
    responseType: 'blob',
  });
  return data;
}
