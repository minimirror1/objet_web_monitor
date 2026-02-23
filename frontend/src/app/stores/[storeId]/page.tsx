"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { StoreDetailView } from "@/components/stores/store-detail";
import { useDeleteStore, useStoreDetail } from "@/lib/hooks/use-stores";

type Params = { params: Promise<{ storeId: string }> };

export default function StoreDetailPage({ params }: Params) {
  const { storeId } = use(params);
  const router = useRouter();
  const { data: store, isLoading, isError } = useStoreDetail(storeId);
  const { mutateAsync: deleteStore, isPending: isDeleting } = useDeleteStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  async function handleDeleteConfirm() {
    await deleteStore(storeId);
    setShowDeleteDialog(false);
    toast.success("매장이 삭제되었습니다.");
    router.push("/stores");
  }

  return (
    <>
    <main className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb items={[
          { href: "/stores", label: "매장 관리" },
          { label: store?.store_name ?? storeId },
        ]} />
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/stores/${storeId}/edit`}>수정</Link>
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          매장 정보를 불러오는데 실패했습니다.
        </div>
      )}

      {store && (
        <StoreDetailView store={store} onDelete={() => setShowDeleteDialog(true)} isDeleting={isDeleting} />
      )}
    </main>

    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>매장 삭제</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">&quot;{store?.store_name}&quot;</span> 매장을 삭제하시겠습니까?
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
