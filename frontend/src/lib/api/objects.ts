import { apiClient } from "@/lib/api/client";
import type {
  ObjectCreateRequest,
  ObjectCreateResponse,
  ObjectDetail,
  ObjectItem,
  ObjectLogRequest,
  ObjectLogResponse,
  ObjectPowerControlRequest,
  ObjectUpdateRequest,
} from "@/lib/types/object";

export async function getObjects(storeId: string, pcId: string) {
  const response = await apiClient.get<ObjectItem[]>(
    `/v1/service/stores/${storeId}/pcs/${pcId}/objects`
  );
  return response.data;
}

export async function getObject(objectId: string) {
  const response = await apiClient.get<ObjectDetail>(`/v1/service/objects/${objectId}`);
  return response.data;
}

export async function createObject(
  storeId: string,
  pcId: string,
  payload: ObjectCreateRequest
) {
  const response = await apiClient.post<ObjectCreateResponse>(
    `/v1/service/stores/${storeId}/pcs/${pcId}/objects`,
    payload
  );
  return response.data;
}

export async function updateObject(objectId: string, payload: ObjectUpdateRequest) {
  const response = await apiClient.put<ObjectDetail>(
    `/v1/service/objects/${objectId}`,
    payload
  );
  return response.data;
}

export async function deleteObject(objectId: string) {
  const response = await apiClient.delete(`/v1/service/objects/${objectId}`);
  return response.data;
}

export async function controlObjectPower(
  objectId: string,
  payload: ObjectPowerControlRequest
) {
  const response = await apiClient.post<Record<string, boolean>>(
    `/v1/service/objects/${objectId}/power`,
    payload
  );
  return response.data;
}

export async function sendObjectLog(objectId: string, payload: ObjectLogRequest) {
  const response = await apiClient.post<ObjectLogResponse>(
    `/v1/service/objects/${objectId}/logs`,
    payload
  );
  return response.data;
}
