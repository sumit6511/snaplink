import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getLinkStatsRequest,
  listLinksRequest,
  type ListLinksParams,
} from '@/services/link.service';

export function useLinks(params: ListLinksParams) {
  return useQuery({
    queryKey: ['links', params],
    queryFn: () => listLinksRequest(params),
    placeholderData: keepPreviousData,
  });
}

export function useLinkStats() {
  return useQuery({
    queryKey: ['links', 'stats'],
    queryFn: getLinkStatsRequest,
  });
}
