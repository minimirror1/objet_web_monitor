"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StoreForm, type StoreFormValues } from "@/components/stores/store-form";
import { useCreateStore } from "@/lib/hooks/use-stores";

export default function StoreNewPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateStore();

  async function handleSubmit(values: StoreFormValues) {
    const result = await mutateAsync(values);
    toast.success("매장이 등록되었습니다.");
    router.push(`/stores/${result.store_id}`);
  }

  return (
    <main className="p-6 max-w-3xl">
      <h1 className="text-xl font-semibold mb-6">매장 등록</h1>
      <StoreForm onSubmit={handleSubmit} isLoading={isPending} />
    </main>
  );
}
