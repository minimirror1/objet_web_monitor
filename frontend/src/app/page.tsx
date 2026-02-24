"use client";

import { CyberMap } from "@/components/dashboard/cyber-map";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { StatusChart } from "@/components/dashboard/status-chart";
import { ErrorTable } from "@/components/dashboard/error-table";
import { useDashboardData } from "@/lib/hooks/use-dashboard";

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
    <main className="space-y-6">
      {/* ① 사이버 세계지도 - 최상단 전체 너비 */}
      <CyberMap stores={mapStores} isLoading={isLoading} />

      <div className="px-6 space-y-6 pb-6">
        {/* ② 페이지 제목 */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">대시보드</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            매장 · PC · 오브제 전체 현황
          </p>
        </div>

        {/* ③ 통계 카드 */}
        <StatsCards
          totalStores={totalStores}
          totalPcs={totalPcs}
          totalObjects={totalObjects}
          totalErrors={totalErrors}
          isLoading={isLoading}
          loadedCount={loadedCount}
          totalCountryCodes={totalCountryCodes}
        />

        {/* ④ 상태 차트 + 알림 테이블 2단 그리드 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <StatusChart
            powerData={powerData}
            opStatusData={opStatusData}
            isLoading={isLoading}
          />
          <ErrorTable alerts={alerts} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
