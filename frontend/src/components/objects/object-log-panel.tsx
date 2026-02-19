"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSendObjectLog } from "@/lib/hooks/use-objects";

interface ObjectLogPanelProps {
  objectId: string;
}

export function ObjectLogPanel({ objectId }: ObjectLogPanelProps) {
  const [logData, setLogData] = useState("");
  const { mutateAsync: sendLog, isPending } = useSendObjectLog(objectId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = logData.trim();
    if (!trimmed) return;

    try {
      await sendLog({ log_data: trimmed });
      toast.success("로그가 전송되었습니다.");
      setLogData("");
    } catch {
      toast.error("로그 전송에 실패했습니다.");
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">로그 전송</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="전송할 로그 데이터를 입력하세요..."
            value={logData}
            onChange={(e) => setLogData(e.target.value)}
            rows={3}
            className="resize-none text-sm"
          />
          <Button type="submit" size="sm" disabled={isPending || !logData.trim()}>
            {isPending ? "전송 중..." : "로그 전송"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
