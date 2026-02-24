"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OperateTimeFields } from "@/components/stores/operate-time-fields";
import ReactCountryFlag from "react-country-flag";
import { COUNTRIES } from "@/lib/utils/constants";
import { DAYS_OF_WEEK } from "@/lib/types/store";
import type { StoreDetail } from "@/lib/types/store";

const operateTimeSchema = z.object({
  day_of_week: z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]),
  open_time: z.string().min(1, "오픈 시간을 입력하세요"),
  close_time: z.string().min(1, "마감 시간을 입력하세요"),
});

const storeSchema = z.object({
  store_name: z.string().min(1, "매장명을 입력하세요"),
  country_code: z.string().min(1, "국가코드를 선택하세요"),
  address: z.string().min(1, "주소를 입력하세요"),
  latitude: z.number({ message: "숫자를 입력하세요" }),
  longitude: z.number({ message: "숫자를 입력하세요" }),
  timezone: z.string().min(1, "타임존을 선택하세요"),
  operate_times: z.array(operateTimeSchema).length(7),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

function buildDefaultOperateTimes() {
  return DAYS_OF_WEEK.map((day) => ({
    day_of_week: day,
    open_time: "09:00",
    close_time: "18:00",
  }));
}

interface StoreFormProps {
  defaultValues?: StoreDetail;
  onSubmit: (values: StoreFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function StoreForm({ defaultValues, onSubmit, isLoading }: StoreFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema) as never,
    defaultValues: defaultValues
      ? {
          store_name: defaultValues.store_name,
          country_code: defaultValues.country_code,
          address: defaultValues.address ?? "",
          latitude: defaultValues.latitude ?? 0,
          longitude: defaultValues.longitude ?? 0,
          timezone: defaultValues.timezone,
          operate_times:
            defaultValues.operate_times.length === 7
              ? (defaultValues.operate_times as StoreFormValues["operate_times"])
              : buildDefaultOperateTimes(),
        }
      : {
          store_name: "",
          country_code: "",
          address: "",
          latitude: 0,
          longitude: 0,
          timezone: "Asia/Seoul",
          operate_times: buildDefaultOperateTimes(),
        },
  });

  const watchedTimezone = watch("timezone");

  async function onFormSubmit(values: StoreFormValues) {
    try {
      await onSubmit(values);
    } catch {
      toast.error("저장에 실패했습니다.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="store_name">매장명 *</Label>
          <Input id="store_name" {...register("store_name")} />
          {errors.store_name && <p className="text-xs text-red-500">{errors.store_name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>국가 *</Label>
          <Select
            defaultValue={defaultValues?.country_code}
            onValueChange={(v) => {
              setValue("country_code", v);
              const found = COUNTRIES.find((c) => c.code === v);
              if (found) setValue("timezone", found.timezone);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="국가 선택" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <span className="flex items-center gap-1.5">
                    <ReactCountryFlag countryCode={country.code} svg style={{ width: "1.2em", height: "0.9em" }} />
                    {country.code} {country.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country_code && <p className="text-xs text-red-500">{errors.country_code.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">주소 *</Label>
        <Input id="address" {...register("address")} />
        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="latitude">위도 *</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            {...register("latitude", { valueAsNumber: true })}
          />
          {errors.latitude && <p className="text-xs text-red-500">{errors.latitude.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="longitude">경도 *</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            {...register("longitude", { valueAsNumber: true })}
          />
          {errors.longitude && <p className="text-xs text-red-500">{errors.longitude.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>타임존 *</Label>
        <Select
          value={watchedTimezone}
          onValueChange={(v) => setValue("timezone", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="타임존 선택" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country.timezone} value={country.timezone}>
                <span className="flex items-center gap-1.5">
                  <ReactCountryFlag countryCode={country.code} svg style={{ width: "1.2em", height: "0.9em" }} />
                  {country.timezone}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.timezone && <p className="text-xs text-red-500">{errors.timezone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>운영시간 *</Label>
        <OperateTimeFields control={control} />
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
