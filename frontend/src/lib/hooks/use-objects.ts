"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  controlObjectPower,
  createObject,
  deleteObject,
  getObject,
  getObjects,
  sendObjectLog,
  updateObject,
} from "@/lib/api/objects";
import type {
  ObjectCreateRequest,
  ObjectLogRequest,
  ObjectPowerControlRequest,
  ObjectUpdateRequest,
} from "@/lib/types/object";
import { useSse } from "@/lib/hooks/use-sse";

const BASE_URL = "/proxy";

export function useObjects(storeId: string, pcId: string) {
  return useQuery({
    queryKey: ["objects", storeId, pcId],
    queryFn: () => getObjects(storeId, pcId),
    enabled: Boolean(storeId && pcId),
  });
}

export function useObject(objectId: string) {
  return useQuery({
    queryKey: ["object", objectId],
    queryFn: () => getObject(objectId),
    enabled: Boolean(objectId),
  });
}

export function useCreateObject(storeId: string, pcId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ObjectCreateRequest) => createObject(storeId, pcId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects", storeId, pcId] });
    },
  });
}

export function useUpdateObject(objectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ObjectUpdateRequest) => updateObject(objectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["object", objectId] });
    },
  });
}

export function useDeleteObject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (objectId: string) => deleteObject(objectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
    },
  });
}

export function useDeleteObjects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (objectIds: string[]) =>
      Promise.all(objectIds.map((id) => deleteObject(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objects"] });
    },
  });
}

export function useSendObjectLog(objectId: string) {
  return useMutation({
    mutationFn: (payload: ObjectLogRequest) => sendObjectLog(objectId, payload),
  });
}

export function useObjectPower(objectId: string) {
  const url = `${BASE_URL}/v1/service/objects/${objectId}/power`;
  return useSse<string>({ url });
}

export function useControlObjectPower(objectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ObjectPowerControlRequest) => controlObjectPower(objectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["object", objectId] });
    },
  });
}
