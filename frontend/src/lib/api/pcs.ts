import { apiClient } from "@/lib/api/client";
import type { Pc, PcAddResponse, PcCreateRequest, PcUpdateRequest } from "@/lib/types/pc";

export async function getPcs(storeId: string) {
  const response = await apiClient.get<{ pcs: Pc[] }>(`/v1/service/stores/${storeId}/pcs`);
  return response.data.pcs;
}

export async function getPc(storeId: string, pcId: string) {
  const response = await apiClient.get<Pc>(`/v1/service/stores/${storeId}/pcs/${pcId}`);
  return response.data;
}

export async function createPc(storeId: string, payload: PcCreateRequest) {
  const response = await apiClient.post<PcAddResponse>(`/v1/service/stores/${storeId}/pcs`, payload);
  return response.data;
}

export async function updatePc(storeId: string, pcId: string, payload: PcUpdateRequest) {
  const response = await apiClient.put(`/v1/service/stores/${storeId}/pcs/${pcId}`, payload);
  return response.data;
}

// 삭제 엔드포인트는 /pcs/ 없이 바로 /{pc_id}
export async function deletePc(storeId: string, pcId: string) {
  const response = await apiClient.delete(`/v1/service/stores/${storeId}/${pcId}`);
  return response.data;
}
