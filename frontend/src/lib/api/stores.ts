import { apiClient } from "@/lib/api/client";
import type { Store, StoreCreateRequest, StoreDetail, StoreUpdateRequest } from "@/lib/types/store";

export async function getStores(countryCode?: string) {
  const response = await apiClient.get<{ stores: Store[] }>("/v1/service/stores", {
    params: countryCode ? { country_code: countryCode } : undefined,
  });
  return response.data.stores;
}

export async function getStore(storeId: string) {
  const response = await apiClient.get<Store>(`/v1/service/stores/${storeId}`);
  return response.data;
}

export async function getStoreDetail(storeId: string) {
  const response = await apiClient.get<StoreDetail>(`/v1/service/stores/${storeId}/detail`);
  return response.data;
}

export async function createStore(payload: StoreCreateRequest) {
  const response = await apiClient.post<{ store_id: string }>("/v1/service/stores", payload);
  return response.data;
}

export async function updateStore(storeId: string, payload: StoreUpdateRequest) {
  const response = await apiClient.put(`/v1/service/stores/${storeId}`, payload);
  return response.data;
}

export async function deleteStore(storeId: string) {
  const response = await apiClient.delete(`/v1/service/stores/${storeId}`);
  return response.data;
}
