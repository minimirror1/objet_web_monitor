"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ObjectForm, type ObjectFormValues } from "@/components/objects/object-form";
import { useObject, useUpdateObject } from "@/lib/hooks/use-objects";

type Params = { params: Promise<{ objectId: string }> };

export default function ObjectEditPage({ params }: Params) {
  const { objectId } = use(params);
  const router = useRouter();

  const { data: obj, isLoading, isError } = useObject(objectId);
  const { mutateAsync: updateObject, isPending } = useUpdateObject(objectId);

  async function handleSubmit(values: ObjectFormValues) {
    await updateObject(values);
    toast.success("오브제 정보가 수정되었습니다.");
    router.push(`/objects/${objectId}`);
  }

  return (
    <main className="p-6 max-w-2xl">
      <Breadcrumb items={[
        { href: "/stores", label: "매장 관리" },
        { href: `/objects/${objectId}`, label: obj?.object_name ?? objectId },
        { label: "수정" },
      ]} />

      <h1 className="text-xl font-semibold mb-6">오브제 수정</h1>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          오브제 정보를 불러오는데 실패했습니다.
        </div>
      )}

      {obj && (
        <ObjectForm defaultValues={obj} onSubmit={handleSubmit} isLoading={isPending} />
      )}
    </main>
  );
}
