"use client";

import { useQueries } from "@tanstack/react-query";
import { getStoreDetail } from "@/lib/api/stores";
import { useAllStores } from "@/lib/hooks/use-stores";
import type { Store } from "@/lib/types/store";

export type PowerChartDatum = { name: string; value: number; fill: string };
export type OpStatusChartDatum = { name: string; value: number; fill: string };

export type AlertRow = {
  storeId: string;
  storeName: string;
  pcName: string;
  objectId: string;
  objectName: string;
  errorCount: number;
  powerStatus?: "ON" | "OFF";
};

const OP_FILL: Record<string, string> = {
  PLAY: "#22c55e",
  STOP: "#94a3b8",
  REPEAT: "#f59e0b",
};

export function useDashboardData() {
  const {
    data: stores,
    isLoading: storesLoading,
    loadedCount,
    total: totalCountryCodes,
  } = useAllStores();

  const storeDetailResults = useQueries({
    queries: stores.map((store: Store) => ({
      queryKey: ["store-detail", store.id],
      queryFn: () => getStoreDetail(store.id),
      staleTime: 30_000,
    })),
  });

  const detailsLoading = storeDetailResults.some((r) => r.isPending);
  const isLoading = storesLoading || detailsLoading;

  const storeDetails = storeDetailResults.flatMap((r) => (r.data ? [r.data] : []));

  /* ── 통계 ── */
  const totalStores = stores.length;
  const totalPcs = storeDetails.reduce((sum, s) => sum + s.pcs.length, 0);
  const totalObjects = storeDetails.reduce(
    (sum, s) => sum + s.pcs.reduce((p, pc) => p + pc.objects.length, 0),
    0
  );
  let totalErrors = 0;
  let onCount = 0;
  let offCount = 0;
  const opCounts: Record<string, number> = { PLAY: 0, STOP: 0, REPEAT: 0 };
  const alerts: AlertRow[] = [];

  storeDetails.forEach((s) => {
    s.pcs.forEach((pc) => {
      pc.objects.forEach((obj) => {
        const errCount = obj.error_data?.length ?? 0;
        totalErrors += errCount;

        if (obj.power_status === "ON") onCount++;
        else offCount++;

        if (obj.operation_status && obj.operation_status in opCounts) {
          opCounts[obj.operation_status]++;
        }

        if (errCount > 0 || obj.power_status === "OFF") {
          alerts.push({
            storeId: s.store_id,
            storeName: s.store_name,
            pcName: pc.pc_name,
            objectId: obj.id,
            objectName: obj.object_name,
            errorCount: errCount,
            powerStatus: obj.power_status,
          });
        }
      });
    });
  });

  /* ── 차트 데이터 ── */
  const powerData: PowerChartDatum[] = [
    { name: "ON", value: onCount, fill: "#22c55e" },
    { name: "OFF", value: offCount, fill: "#94a3b8" },
  ];

  const opStatusData: OpStatusChartDatum[] = Object.entries(opCounts).map(
    ([name, value]) => ({ name, value, fill: OP_FILL[name] ?? "#94a3b8" })
  );

  /* ── 지도용 매장 ── */
  const mapStores = stores.filter(
    (s: Store) => s.latitude != null && s.longitude != null
  );

  return {
    isLoading,
    loadedCount,
    totalCountryCodes,
    totalStores,
    totalPcs,
    totalObjects,
    totalErrors,
    powerData,
    opStatusData,
    mapStores,
    alerts,
  };
}
