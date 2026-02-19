"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Pc } from "@/lib/types/pc";

const pcSchema = z.object({
  pc_name: z.string().min(1, "PC명을 입력하세요"),
  sw_version: z.string().min(1, "SW 버전을 입력하세요"),
});

export type PcFormValues = z.infer<typeof pcSchema>;

interface PcFormProps {
  defaultValues?: Pick<Pc, "pc_name" | "sw_version">;
  onSubmit: (values: PcFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function PcForm({ defaultValues, onSubmit, isLoading }: PcFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PcFormValues>({
    resolver: zodResolver(pcSchema) as never,
    defaultValues: {
      pc_name: defaultValues?.pc_name ?? "",
      sw_version: defaultValues?.sw_version ?? "",
    },
  });

  async function onFormSubmit(values: PcFormValues) {
    try {
      await onSubmit(values);
    } catch {
      toast.error("저장에 실패했습니다.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 max-w-md">
      <div className="space-y-1.5">
        <Label htmlFor="pc_name">PC명 *</Label>
        <Input id="pc_name" placeholder="PC001" {...register("pc_name")} />
        {errors.pc_name && <p className="text-xs text-red-500">{errors.pc_name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sw_version">SW 버전 *</Label>
        <Input id="sw_version" placeholder="10.0" {...register("sw_version")} />
        {errors.sw_version && <p className="text-xs text-red-500">{errors.sw_version.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "저장 중..." : "저장"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </form>
  );
}
