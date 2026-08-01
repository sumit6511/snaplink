import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bulkImportLinksRequest,
  createLinkRequest,
  deleteLinkRequest,
  getLinkStatsRequest,
  listLinksRequest,
  updateLinkRequest,
  type CreateLinkInput,
  type ListLinksParams,
  type UpdateLinkInput,
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

export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLinkInput) => createLinkRequest(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLinkInput }) =>
      updateLinkRequest(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}

export function useBulkImportLinks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (urls: string[]) => bulkImportLinksRequest(urls),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLinkRequest(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}
