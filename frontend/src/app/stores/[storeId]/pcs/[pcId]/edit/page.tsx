"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PcForm, type PcFormValues } from "@/components/pcs/pc-form";
import { usePc, useUpdatePc } from "@/lib/hooks/use-pcs";

type Params = { params: Promise<{ storeId: string; pcId: string }> };

export default function PcEditPage({ params }: Params) {
  const { storeId, pcId } = use(params);
  const router = useRouter();

  const { data: pc, isLoading, isError } = usePc(storeId, pcId);
  const { mutateAsync: updatePc, isPending } = useUpdatePc(storeId, pcId);

  async function handleSubmit(values: PcFormValues) {
    await updatePc(values);
    toast.success("PC 정보가 수정되었습니다.");
    router.push(`/stores/${storeId}/pcs/${pcId}`);
  }

  return (
    <main className="p-6 max-w-2xl">
      <Breadcrumb items={[
        { href: "/stores", label: "매장 관리" },
        { href: `/stores/${storeId}`, label: storeId },
        { href: `/stores/${storeId}/pcs/${pcId}`, label: pc?.pc_name ?? pcId },
        { label: "수정" },
      ]} />

      <h1 className="text-xl font-semibold mb-6">PC 수정</h1>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          PC 정보를 불러오는데 실패했습니다.
        </div>
      )}

      {pc && (
        <PcForm defaultValues={pc} onSubmit={handleSubmit} isLoading={isPending} />
      )}
    </main>
  );
}
