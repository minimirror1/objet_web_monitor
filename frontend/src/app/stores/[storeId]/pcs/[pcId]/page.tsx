"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PcHealthBadge } from "@/components/pcs/pc-health-badge";
import { ObjectPowerBadge } from "@/components/objects/object-power-badge";
import { useDeletePc, usePc } from "@/lib/hooks/use-pcs";
import { useObjects } from "@/lib/hooks/use-objects";
import { formatDateTime } from "@/lib/utils/format";

type Params = { params: Promise<{ storeId: string; pcId: string }> };

const STATUS_COLOR = {
  PLAY: "default",
  STOP: "secondary",
  REPEAT: "outline",
} as const;

export default function PcDetailPage({ params }: Params) {
  const { storeId, pcId } = use(params);
  const router = useRouter();

  const { data: pc, isLoading: pcLoading, isError: pcError } = usePc(storeId, pcId);
  const { data: objects, isLoading: objLoading } = useObjects(storeId, pcId);
  const { mutateAsync: deletePc, isPending: isDeleting } = useDeletePc();

  async function handleDelete() {
    if (!confirm(`"${pc?.pc_name}" PC를 삭제하시겠습니까?`)) return;
    await deletePc({ storeId, pcId });
    toast.success("PC가 삭제되었습니다.");
    router.push(`/stores/${storeId}`);
  }

  return (
    <main className="p-6 max-w-4xl">
      {/* 브레드크럼 */}
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb items={[
          { href: "/stores", label: "매장 관리" },
          { href: `/stores/${storeId}`, label: storeId },
          { label: pc?.pc_name ?? pcId },
        ]} />
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/stores/${storeId}/pcs/${pcId}/edit`}>수정</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </div>

      {pcLoading && <Skeleton className="h-40 w-full mb-4" />}
      {pcError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600 mb-4">
          PC 정보를 불러오는데 실패했습니다.
        </div>
      )}

      {pc && (
        <div className="space-y-6">
          {/* PC 기본 정보 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">PC 정보</CardTitle>
              <PcHealthBadge storeId={storeId} pcId={pcId} />
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">PC ID</dt>
                  <dd className="font-mono mt-0.5">{pc.pc_id}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">PC명</dt>
                  <dd className="font-medium mt-0.5">{pc.pc_name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">SW 버전</dt>
                  <dd className="mt-0.5">
                    <Badge variant="secondary">{pc.sw_version}</Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">등록일</dt>
                  <dd className="mt-0.5">{formatDateTime(pc.created_at)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* 오브제 목록 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">
                오브제 목록
                {objects && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">({objects.length}개)</span>
                )}
              </CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link href={`/stores/${storeId}/pcs/${pcId}/objects/new`}>+ 오브제 등록</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {objLoading && (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              )}

              {objects && objects.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">등록된 오브제가 없습니다.</p>
              )}

              {objects && objects.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {objects.map((obj) => (
                    <Link
                      key={obj.id}
                      href={`/objects/${obj.id}`}
                      className="flex items-center justify-between rounded-md border p-3 hover:bg-accent transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{obj.object_name}</p>
                        <div className="flex gap-1.5 items-center">
                          <ObjectPowerBadge objectId={obj.id} initialPower={obj.power_status} />
                          <Badge
                            variant={STATUS_COLOR[obj.operation_status] ?? "outline"}
                            className="text-xs"
                          >
                            {obj.operation_status}
                          </Badge>
                        </div>
                      </div>
                      {obj.error_data && obj.error_data.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          에러 {obj.error_data.length}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
