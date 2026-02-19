"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { StoreForm, type StoreFormValues } from "@/components/stores/store-form";
import { useStoreDetail, useUpdateStore } from "@/lib/hooks/use-stores";

type Params = { params: Promise<{ storeId: string }> };

export default function StoreEditPage({ params }: Params) {
  const { storeId } = use(params);
  const router = useRouter();
  const { data: store, isLoading, isError } = useStoreDetail(storeId);
  const { mutateAsync: updateStore, isPending } = useUpdateStore(storeId);

  async function handleSubmit(values: StoreFormValues) {
    await updateStore(values);
    toast.success("매장 정보가 수정되었습니다.");
    router.push(`/stores/${storeId}`);
  }

  return (
    <main className="p-6 max-w-3xl">
      <Breadcrumb items={[
        { href: "/stores", label: "매장 관리" },
        { href: `/stores/${storeId}`, label: store?.store_name ?? storeId },
        { label: "수정" },
      ]} />

      <h1 className="text-xl font-semibold mb-6">매장 수정</h1>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          매장 정보를 불러오는데 실패했습니다.
        </div>
      )}

      {store && (
        <StoreForm defaultValues={store} onSubmit={handleSubmit} isLoading={isPending} />
      )}
    </main>
  );
}
