"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DAYS_OF_WEEK, type DayOfWeek } from "@/lib/types/store";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";

const DAY_LABELS: Record<DayOfWeek, string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const MINUTES = ["00", "15", "30", "45"];

function TimeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [hour, minute] = (value ?? "00:00").split(":");

  return (
    <div className="flex gap-1">
      <Select
        value={hour ?? "00"}
        onValueChange={(h) => onChange(`${h}:${minute ?? "00"}`)}
      >
        <SelectTrigger size="sm" className="w-[58px] px-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-48">
          {HOURS.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="flex items-center text-sm text-muted-foreground">:</span>
      <Select
        value={minute ?? "00"}
        onValueChange={(m) => onChange(`${hour ?? "00"}:${m}`)}
      >
        <SelectTrigger size="sm" className="w-[64px] px-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface OperateTimeFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}

export function OperateTimeFields({ control }: OperateTimeFieldsProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground px-1">
        <span>요일</span>
        <span>오픈</span>
        <span>마감</span>
      </div>
      {DAYS_OF_WEEK.map((day, idx) => (
        <div key={day} className="grid grid-cols-3 gap-2 items-center">
          <span className="text-sm font-medium">{DAY_LABELS[day]}</span>
          <Controller
            name={`operate_times.${idx}.open_time`}
            control={control}
            render={({ field }) => (
              <TimeSelect value={field.value} onChange={field.onChange} />
            )}
          />
          <Controller
            name={`operate_times.${idx}.close_time`}
            control={control}
            render={({ field }) => (
              <TimeSelect value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      ))}
    </div>
  );
}
