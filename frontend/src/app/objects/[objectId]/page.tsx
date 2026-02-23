"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PowerToggle } from "@/components/objects/power-toggle";
import { ObjectPowerBadge } from "@/components/objects/object-power-badge";
import { OperationStatusBadge, PowerStatusBadge } from "@/components/objects/status-badge";
import { ErrorList } from "@/components/objects/error-list";
import { ObjectLogPanel } from "@/components/objects/object-log-panel";
import { useObject, useDeleteObject } from "@/lib/hooks/use-objects";
import { formatDateTime } from "@/lib/utils/format";

type Params = { params: Promise<{ objectId: string }> };

export default function ObjectDetailPage({ params }: Params) {
  const { objectId } = use(params);
  const router = useRouter();

  const { data: obj, isLoading, isError } = useObject(objectId);
  const { mutateAsync: deleteObject, isPending: isDeleting } = useDeleteObject();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function handleDeleteConfirm() {
    await deleteObject(objectId);
    setShowDeleteDialog(false);
    toast.success("오브제가 삭제되었습니다.");
    router.back();
  }

  return (
    <>
    <main className="p-6 max-w-4xl">
      {/* 브레드크럼 + 액션 */}
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb items={[
          { href: "/stores", label: "매장 관리" },
          { label: obj?.object_name ?? objectId },
        ]} />
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/objects/${objectId}/edit`}>수정</Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </div>

      {isLoading && <Skeleton className="h-40 w-full mb-4" />}
      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600 mb-4">
          오브제 정보를 불러오는데 실패했습니다.
        </div>
      )}

      {obj && (
        <div className="space-y-6">
          {/* 기본 정보 카드 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">오브제 정보</CardTitle>
              <div className="flex items-center gap-2">
                <ObjectPowerBadge objectId={objectId} initialPower={obj.power_status} />
                <PowerToggle objectId={objectId} currentPower={obj.power_status} />
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">ID</dt>
                  <dd className="font-mono mt-0.5 text-xs">{obj.id}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">이름</dt>
                  <dd className="font-medium mt-0.5">{obj.object_name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">전원 상태</dt>
                  <dd className="mt-0.5">
                    <PowerStatusBadge status={obj.power_status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">동작 상태</dt>
                  <dd className="mt-0.5">
                    <OperationStatusBadge status={obj.operation_status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">스케줄</dt>
                  <dd className="mt-0.5">{obj.schedule_flag ? "사용" : "미사용"}</dd>
                </div>
                {obj.object_operation_time && (
                  <div>
                    <dt className="text-muted-foreground">운영 시간</dt>
                    <dd className="mt-0.5 font-mono text-xs">
                      {obj.object_operation_time.start_time} ~ {obj.object_operation_time.end_time}
                    </dd>
                  </div>
                )}
                {obj.created_at && (
                  <div>
                    <dt className="text-muted-foreground">등록일</dt>
                    <dd className="mt-0.5">{formatDateTime(obj.created_at)}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* 전력 소비 */}
          {obj.power_consumption && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">전력 소비</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">전압 (V)</dt>
                    <dd className="font-mono mt-0.5">{obj.power_consumption.volt}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">전류 (A)</dt>
                    <dd className="font-mono mt-0.5">{obj.power_consumption.ampere}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">전력 (W)</dt>
                    <dd className="font-mono mt-0.5">{obj.power_consumption.watt}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}

          {/* 펌웨어 버전 */}
          {obj.firmware_version && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">펌웨어 버전</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">보드 ID</dt>
                    <dd className="font-mono mt-0.5 text-xs">{obj.firmware_version.board_id}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">보드 타입</dt>
                    <dd className="mt-0.5">{obj.firmware_version.board_type}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">버전</dt>
                    <dd className="font-mono mt-0.5">{obj.firmware_version.version}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}

          {/* 로그 전송 */}
          <ObjectLogPanel objectId={objectId} />

          {/* 에러 데이터 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                에러 데이터
                {obj.error_data && obj.error_data.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-red-500">
                    ({obj.error_data.length}건)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorList errors={obj.error_data ?? []} />
            </CardContent>
          </Card>
        </div>
      )}
    </main>

    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>오브제 삭제</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">&quot;{obj?.object_name}&quot;</span> 오브제를 삭제하시겠습니까?
            <br />
            삭제된 데이터는 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
            취소
          </Button>
          <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
            {isDeleting ? "삭제 중..." : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
