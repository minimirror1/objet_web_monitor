"use client";

import { Input } from "@/components/ui/input";
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
              <Input type="time" {...field} className="h-8 text-sm" />
            )}
          />
          <Controller
            name={`operate_times.${idx}.close_time`}
            control={control}
            render={({ field }) => (
              <Input type="time" {...field} className="h-8 text-sm" />
            )}
          />
        </div>
      ))}
    </div>
  );
}
