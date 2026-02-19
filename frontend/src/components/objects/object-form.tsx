"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ObjectDetail } from "@/lib/types/object";

const objectSchema = z.object({
  object_name: z.string().min(1, "오브제 이름을 입력하세요"),
  operation_status: z.enum(["PLAY", "STOP", "REPEAT"]),
  schedule_flag: z.boolean(),
  object_operation_time: z.object({
    start_time: z.string().min(1, "시작 시간을 입력하세요"),
    end_time: z.string().min(1, "종료 시간을 입력하세요"),
  }),
  firmware_version: z.object({
    board_id: z.string().min(1, "보드 ID를 입력하세요"),
    board_type: z.string().min(1, "보드 타입을 입력하세요"),
    version: z.string().min(1, "버전을 입력하세요"),
  }),
});

export type ObjectFormValues = z.infer<typeof objectSchema>;

interface ObjectFormProps {
  defaultValues?: Partial<ObjectDetail>;
  onSubmit: (values: ObjectFormValues) => Promise<void>;
  isLoading?: boolean;
}

const FORM_DEFAULTS: ObjectFormValues = {
  object_name: "",
  operation_status: "STOP",
  schedule_flag: false,
  object_operation_time: { start_time: "09:00", end_time: "22:00" },
  firmware_version: { board_id: "", board_type: "", version: "" },
};

export function ObjectForm({ defaultValues, onSubmit, isLoading }: ObjectFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ObjectFormValues>({
    resolver: zodResolver(objectSchema) as never,
    defaultValues: defaultValues
      ? {
          object_name: defaultValues.object_name ?? "",
          operation_status: defaultValues.operation_status ?? "STOP",
          schedule_flag: defaultValues.schedule_flag ?? false,
          object_operation_time: defaultValues.object_operation_time ?? {
            start_time: "09:00",
            end_time: "22:00",
          },
          firmware_version: defaultValues.firmware_version ?? {
            board_id: "",
            board_type: "",
            version: "",
          },
        }
      : FORM_DEFAULTS,
  });

  const scheduleFlag = watch("schedule_flag");
  const operationStatus = watch("operation_status");

  async function onFormSubmit(values: ObjectFormValues) {
    try {
      await onSubmit(values);
    } catch {
      toast.error("저장에 실패했습니다.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-w-2xl">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">기본 정보</h3>

        <div className="space-y-1.5">
          <Label htmlFor="object_name">오브제 이름 *</Label>
          <Input id="object_name" placeholder="Robot 1" {...register("object_name")} />
          {errors.object_name && (
            <p className="text-xs text-red-500">{errors.object_name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>동작 상태 *</Label>
          <Select
            value={operationStatus}
            onValueChange={(v) =>
              setValue("operation_status", v as ObjectFormValues["operation_status"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PLAY">PLAY</SelectItem>
              <SelectItem value="STOP">STOP</SelectItem>
              <SelectItem value="REPEAT">REPEAT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="schedule_flag"
            checked={scheduleFlag}
            onCheckedChange={(checked) => setValue("schedule_flag", checked)}
          />
          <Label htmlFor="schedule_flag">스케줄 사용</Label>
        </div>
      </div>

      {/* 운영 시간 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">운영 시간</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="start_time">시작 시간 *</Label>
            <Input
              id="start_time"
              type="time"
              {...register("object_operation_time.start_time")}
            />
            {errors.object_operation_time?.start_time && (
              <p className="text-xs text-red-500">
                {errors.object_operation_time.start_time.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="end_time">종료 시간 *</Label>
            <Input
              id="end_time"
              type="time"
              {...register("object_operation_time.end_time")}
            />
            {errors.object_operation_time?.end_time && (
              <p className="text-xs text-red-500">
                {errors.object_operation_time.end_time.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 펌웨어 버전 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground border-b pb-1">펌웨어 버전</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="board_id">보드 ID *</Label>
            <Input
              id="board_id"
              placeholder="BOARD001"
              {...register("firmware_version.board_id")}
            />
            {errors.firmware_version?.board_id && (
              <p className="text-xs text-red-500">{errors.firmware_version.board_id.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="board_type">보드 타입 *</Label>
            <Input
              id="board_type"
              placeholder="MAIN"
              {...register("firmware_version.board_type")}
            />
            {errors.firmware_version?.board_type && (
              <p className="text-xs text-red-500">
                {errors.firmware_version.board_type.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fw_version">버전 *</Label>
            <Input
              id="fw_version"
              placeholder="1.0.0"
              {...register("firmware_version.version")}
            />
            {errors.firmware_version?.version && (
              <p className="text-xs text-red-500">{errors.firmware_version.version.message}</p>
            )}
          </div>
        </div>
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
