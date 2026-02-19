"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSendStoreEvent } from "@/lib/hooks/use-stores";
import type { StoreEventType } from "@/lib/types/store";

interface StoreEventPanelProps {
  storeId: string;
}

const EVENT_CONFIG: { type: StoreEventType; label: string; variant: "default" | "destructive" | "outline" }[] = [
  { type: "ON", label: "전원 ON", variant: "default" },
  { type: "OFF", label: "전원 OFF", variant: "destructive" },
  { type: "REBOOT", label: "재부팅", variant: "outline" },
];

export function StoreEventPanel({ storeId }: StoreEventPanelProps) {
  const { mutateAsync: sendEvent, isPending } = useSendStoreEvent();

  async function handleEvent(eventType: StoreEventType) {
    const label = EVENT_CONFIG.find((e) => e.type === eventType)?.label ?? eventType;
    if (!confirm(`매장 전체에 "${label}" 이벤트를 전송하시겠습니까?`)) return;

    try {
      await sendEvent({ store_id: storeId, event_type: eventType });
      toast.success(`"${label}" 이벤트가 전송되었습니다.`);
    } catch {
      toast.error(`이벤트 전송에 실패했습니다.`);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">이벤트 전송</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          매장에 연결된 모든 오브제에 이벤트를 전송합니다.
        </p>
        <div className="flex gap-2">
          {EVENT_CONFIG.map(({ type, label, variant }) => (
            <Button
              key={type}
              variant={variant}
              size="sm"
              onClick={() => handleEvent(type)}
              disabled={isPending}
            >
              {isPending ? "전송 중..." : label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
