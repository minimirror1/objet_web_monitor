"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AlertRow } from "@/lib/hooks/use-dashboard";

interface ErrorTableProps {
  alerts: AlertRow[];
  isLoading: boolean;
}

export function ErrorTable({ alerts, isLoading }: ErrorTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          알림
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2 text-xs">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            이상 없음 — 모든 오브제가 정상 상태입니다.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">매장</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">PC</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">오브제</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">전원</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">에러</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((row) => (
                  <tr key={row.objectId} className="border-b last:border-0 hover:bg-accent">
                    <td className="py-2 px-2">
                      <Link
                        href={`/stores/${row.storeId}`}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        {row.storeName}
                      </Link>
                    </td>
                    <td className="py-2 px-2 text-xs text-muted-foreground">{row.pcName}</td>
                    <td className="py-2 px-2">
                      <Link
                        href={`/objects/${row.objectId}`}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        {row.objectName}
                      </Link>
                    </td>
                    <td className="py-2 px-2">
                      <Badge
                        variant={row.powerStatus === "ON" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {row.powerStatus ?? "–"}
                      </Badge>
                    </td>
                    <td className="py-2 px-2">
                      {row.errorCount > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          에러 {row.errorCount}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">–</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
