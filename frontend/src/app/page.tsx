"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { StatusChart } from "@/components/dashboard/status-chart";
import { ErrorTable } from "@/components/dashboard/error-table";
import { useDashboardData } from "@/lib/hooks/use-dashboard";

// Leaflet은 SSR 미지원 → 클라이언트 전용 동적 로딩
const StoreMap = dynamic(
  () => import("@/components/dashboard/store-map").then((m) => m.StoreMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  }
);

export default function DashboardPage() {
  const {
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
  } = useDashboardData();

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">대시보드</h1>
        <p className="text-sm text-muted-foreground mt-0.5">매장 · PC · 오브제 전체 현황</p>
      </div>

      {/* 통계 카드 */}
      <StatsCards
        totalStores={totalStores}
        totalPcs={totalPcs}
        totalObjects={totalObjects}
        totalErrors={totalErrors}
        isLoading={isLoading}
        loadedCount={loadedCount}
        totalCountryCodes={totalCountryCodes}
      />

      {/* 상태 분포 차트 */}
      <StatusChart
        powerData={powerData}
        opStatusData={opStatusData}
        isLoading={isLoading}
      />

      {/* 지도 + 알림 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 매장 위치 지도 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              매장 위치
              {!isLoading && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {mapStores.length}개 표시
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 rounded overflow-hidden">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <StoreMap stores={mapStores} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* 알림 테이블 */}
        <ErrorTable alerts={alerts} isLoading={isLoading} />
      </div>
    </main>
  );
}
