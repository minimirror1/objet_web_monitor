"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useControlObjectPower } from "@/lib/hooks/use-objects";

interface PowerToggleProps {
  objectId: string;
  currentPower?: "ON" | "OFF";
}

export function PowerToggle({ objectId, currentPower }: PowerToggleProps) {
  const { mutateAsync, isPending } = useControlObjectPower(objectId);
  const isOn = currentPower === "ON";

  async function handleToggle() {
    try {
      await mutateAsync({ power_status: isOn ? "OFF" : "ON" });
      toast.success(`전원을 ${isOn ? "OFF" : "ON"}으로 변경했습니다.`);
    } catch {
      toast.error("전원 제어에 실패했습니다.");
    }
  }

  return (
    <Button
      variant={isOn ? "destructive" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? "처리 중..." : isOn ? "전원 OFF" : "전원 ON"}
    </Button>
  );
}
