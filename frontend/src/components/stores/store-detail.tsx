"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { StoreDetail } from "@/lib/types/store";
import { formatDateTime } from "@/lib/utils/format";

const StoreMiniMap = dynamic(
  () => import("@/components/stores/store-mini-map").then((m) => m.StoreMiniMap),
  { ssr: false },
);

const DAY_LABELS: Record<string, string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

interface StoreDetailViewProps {
  store: StoreDetail;
  onDelete: () => void;
  isDeleting: boolean;
}

export function StoreDetailView({ store, onDelete, isDeleting }: StoreDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* 매장 기본 정보 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">매장 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm flex-1 min-w-0">
              <div>
                <dt className="text-muted-foreground">매장 ID</dt>
                <dd className="font-mono mt-0.5">{store.store_id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">국가</dt>
                <dd className="mt-0.5">
                  <Badge variant="outline">{store.country_code}</Badge>
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">주소</dt>
                <dd className="mt-0.5">{store.address ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">위도</dt>
                <dd className="mt-0.5">{store.latitude ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">경도</dt>
                <dd className="mt-0.5">{store.longitude ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">타임존</dt>
                <dd className="mt-0.5">{store.timezone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">등록일</dt>
                <dd className="mt-0.5">{formatDateTime(store.created_at, store.timezone)}</dd>
              </div>
            </dl>
            {store.latitude != null && store.longitude != null && (
              <div className="w-48 h-40 shrink-0 rounded-lg overflow-hidden border">
                <StoreMiniMap latitude={store.latitude} longitude={store.longitude} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 운영시간 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">운영시간</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>요일</TableHead>
                <TableHead>오픈</TableHead>
                <TableHead>마감</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.operate_times.map((t) => (
                <TableRow key={t.day_of_week}>
                  <TableCell className="font-medium">{DAY_LABELS[t.day_of_week] ?? t.day_of_week}</TableCell>
                  <TableCell>{t.open_time}</TableCell>
                  <TableCell>{t.close_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PC 목록 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">PC 목록</CardTitle>
          <Button asChild size="sm" variant="outline">
            <Link href={`/stores/${store.store_id}/pcs/new`}>+ PC 등록</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {store.pcs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">등록된 PC가 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {store.pcs.map((pc) => (
                <div key={pc.pc_id} className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{pc.pc_name}</span>
                      <Badge variant="secondary" className="text-xs">
                        v{pc.sw_version}
                      </Badge>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/stores/${store.store_id}/pcs/${pc.pc_id}`}>상세 →</Link>
                    </Button>
                  </div>

                  {pc.objects.length === 0 ? (
                    <p className="text-xs text-muted-foreground">오브제 없음</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {pc.objects.map((obj) => (
                        <Link
                          key={obj.id}
                          href={`/objects/${obj.id}`}
                          className="flex items-center gap-2 rounded border p-2 text-sm hover:bg-accent"
                        >
                          <span>{obj.object_name}</span>
                          {obj.power_status && (
                            <Badge
                              variant={obj.power_status === "ON" ? "default" : "secondary"}
                              className="text-xs ml-auto"
                            >
                              {obj.power_status}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 삭제 버튼 */}
      <div className="flex justify-end pt-2">
        <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
          {isDeleting ? "삭제 중..." : "매장 삭제"}
        </Button>
      </div>
    </div>
  );
}
