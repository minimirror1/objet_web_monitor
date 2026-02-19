"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { toast } from "sonner";
import { PcForm, type PcFormValues } from "@/components/pcs/pc-form";
import { useCreatePc } from "@/lib/hooks/use-pcs";

type Params = { params: Promise<{ storeId: string }> };

export default function PcNewPage({ params }: Params) {
  const { storeId } = use(params);
  const router = useRouter();
  const { mutateAsync, isPending } = useCreatePc(storeId);

  async function handleSubmit(values: PcFormValues) {
    const result = await mutateAsync(values);
    toast.success("PC가 등록되었습니다.");
    router.push(`/stores/${storeId}/pcs/${result.pc_id}`);
  }

  return (
    <main className="p-6 max-w-2xl">
      <Breadcrumb items={[
        { href: "/stores", label: "매장 관리" },
        { href: `/stores/${storeId}`, label: storeId },
        { label: "PC 등록" },
      ]} />

      <h1 className="text-xl font-semibold mb-6">PC 등록</h1>
      <PcForm onSubmit={handleSubmit} isLoading={isPending} />
    </main>
  );
}
