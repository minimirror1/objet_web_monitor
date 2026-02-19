"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPc, deletePc, getPc, getPcs, updatePc } from "@/lib/api/pcs";
import { useSse } from "@/lib/hooks/use-sse";
import type { PcCreateRequest, PcUpdateRequest } from "@/lib/types/pc";

const BASE_URL = "/proxy";

export function usePcs(storeId: string) {
  return useQuery({
    queryKey: ["pcs", storeId],
    queryFn: () => getPcs(storeId),
    enabled: Boolean(storeId),
  });
}

export function usePc(storeId: string, pcId: string) {
  return useQuery({
    queryKey: ["pc", storeId, pcId],
    queryFn: () => getPc(storeId, pcId),
    enabled: Boolean(storeId) && Boolean(pcId),
  });
}

export function useCreatePc(storeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PcCreateRequest) => createPc(storeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pcs", storeId] });
      queryClient.invalidateQueries({ queryKey: ["store-detail", storeId] });
    },
  });
}

export function useUpdatePc(storeId: string, pcId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PcUpdateRequest) => updatePc(storeId, pcId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pcs", storeId] });
      queryClient.invalidateQueries({ queryKey: ["pc", storeId, pcId] });
      queryClient.invalidateQueries({ queryKey: ["store-detail", storeId] });
    },
  });
}

export function useDeletePc() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storeId, pcId }: { storeId: string; pcId: string }) =>
      deletePc(storeId, pcId),
    onSuccess: (_data, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: ["pcs", storeId] });
      queryClient.invalidateQueries({ queryKey: ["store-detail", storeId] });
    },
  });
}

export function usePcHealth(storeId: string, pcId: string) {
  const url = `${BASE_URL}/v1/service/stores/${storeId}/pcs/${pcId}/health`;
  return useSse<string>({ url });
}
