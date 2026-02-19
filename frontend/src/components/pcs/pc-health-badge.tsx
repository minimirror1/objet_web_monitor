"use client";

import { usePcHealth } from "@/lib/hooks/use-pcs";

interface PcHealthBadgeProps {
  storeId: string;
  pcId: string;
}

export function PcHealthBadge({ storeId, pcId }: PcHealthBadgeProps) {
  const { connectionState } = usePcHealth(storeId, pcId);

  const config = {
    connected: { label: "온라인", className: "bg-green-100 text-green-700 border-green-200" },
    reconnecting: { label: "연결 중...", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    disconnected: { label: "오프라인", className: "bg-muted text-muted-foreground border-border" },
  } as const;

  const { label, className } = config[connectionState];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          connectionState === "connected"
            ? "bg-green-500"
            : connectionState === "reconnecting"
            ? "bg-yellow-500 animate-pulse"
            : "bg-muted-foreground"
        }`}
      />
      {label}
    </span>
  );
}
