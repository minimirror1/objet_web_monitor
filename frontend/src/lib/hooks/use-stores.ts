"use client";

import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { createStore, deleteStore, getStore, getStoreDetail, getStores, sendStoreEvent, updateStore } from "@/lib/api/stores";
import type { Store, StoreCreateRequest, StoreEventSendRequest, StoreUpdateRequest } from "@/lib/types/store";
import { COUNTRY_CODES } from "@/lib/utils/constants";

/** 단일 국가코드 조회 */
export function useStores(countryCode: string) {
  return useQuery({
    queryKey: ["stores", countryCode],
    queryFn: () => getStores(countryCode),
    enabled: Boolean(countryCode),
  });
}

/** 전체 국가코드를 병렬 조회 후 병합 */
export function useAllStores() {
  const results = useQueries({
    queries: COUNTRY_CODES.map((code) => ({
      queryKey: ["stores", code],
      queryFn: () => getStores(code),
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);
  const loadedCount = results.filter((r) => r.isSuccess).length;
  const data: Store[] = results.flatMap((r) => r.data ?? []);

  return { data, isLoading, isError, loadedCount, total: COUNTRY_CODES.length };
}

export function useStore(storeId: string) {
  return useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStore(storeId),
    enabled: Boolean(storeId),
  });
}

export function useStoreDetail(storeId: string) {
  return useQuery({
    queryKey: ["store-detail", storeId],
    queryFn: () => getStoreDetail(storeId),
    enabled: Boolean(storeId),
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StoreCreateRequest) => createStore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useUpdateStore(storeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StoreUpdateRequest) => updateStore(storeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.invalidateQueries({ queryKey: ["store", storeId] });
      queryClient.invalidateQueries({ queryKey: ["store-detail", storeId] });
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storeId: string) => deleteStore(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
}

export function useSendStoreEvent() {
  return useMutation({
    mutationFn: (payload: StoreEventSendRequest) => sendStoreEvent(payload),
  });
}
