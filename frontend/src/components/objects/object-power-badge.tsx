"use client";

import { useObjectPower } from "@/lib/hooks/use-objects";

interface ObjectPowerBadgeProps {
  objectId: string;
  /** SSE 연결 전 표시할 초기 전원 상태 */
  initialPower?: "ON" | "OFF";
}

export function ObjectPowerBadge({ objectId, initialPower }: ObjectPowerBadgeProps) {
  const { connectionState, lastMessage } = useObjectPower(objectId);

  // SSE로 수신한 값 우선, 없으면 초기값 사용
  const powerStatus = lastMessage ?? initialPower;

  if (connectionState === "reconnecting" && !powerStatus) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 border-yellow-200">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
        연결 중...
      </span>
    );
  }

  if (!powerStatus) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground border-border">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        –
      </span>
    );
  }

  const isOn = powerStatus === "ON";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        isOn
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-muted text-muted-foreground border-border"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isOn ? "bg-green-500" : "bg-muted-foreground"
        }`}
      />
      {isOn ? "ON" : "OFF"}
    </span>
  );
}
