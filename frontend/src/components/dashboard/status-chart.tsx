"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { OpStatusChartDatum, PowerChartDatum } from "@/lib/hooks/use-dashboard";

interface StatusChartProps {
  powerData: PowerChartDatum[];
  opStatusData: OpStatusChartDatum[];
  isLoading: boolean;
}

// Recharts v3: Tooltip formatter는 value가 unknown 타입으로 올 수 있어 as 캐스팅 사용
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fmtCount(value: any) {
  return [`${value}개`];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderPieLabel({ name, percent }: any) {
  const pct = typeof percent === "number" ? (percent * 100).toFixed(0) : "0";
  return `${name ?? ""} ${pct}%`;
}

export function StatusChart({ powerData, opStatusData, isLoading }: StatusChartProps) {
  const totalPower = powerData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* 전원 상태 파이차트 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">전원 상태 분포</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : totalPower === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-16">데이터 없음</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={powerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {powerData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={fmtCount} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 동작 상태 바 차트 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">동작 상태 분포</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={opStatusData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip formatter={fmtCount} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {opStatusData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
