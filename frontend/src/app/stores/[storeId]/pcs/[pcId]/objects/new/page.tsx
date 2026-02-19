"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { toast } from "sonner";
import { ObjectForm, type ObjectFormValues } from "@/components/objects/object-form";
import { useCreateObject } from "@/lib/hooks/use-objects";

type Params = { params: Promise<{ storeId: string; pcId: string }> };

export default function ObjectNewPage({ params }: Params) {
  const { storeId, pcId } = use(params);
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateObject(storeId, pcId);

  async function handleSubmit(values: ObjectFormValues) {
    await mutateAsync(values);
    toast.success("오브제가 등록되었습니다.");
    router.push(`/stores/${storeId}/pcs/${pcId}`);
  }

  return (
    <main className="p-6 max-w-2xl">
      <Breadcrumb items={[
        { href: "/stores", label: "매장 관리" },
        { href: `/stores/${storeId}`, label: storeId },
        { href: `/stores/${storeId}/pcs/${pcId}`, label: pcId },
        { label: "오브제 등록" },
      ]} />

      <h1 className="text-xl font-semibold mb-6">오브제 등록</h1>
      <ObjectForm onSubmit={handleSubmit} isLoading={isPending} />
    </main>
  );
}
