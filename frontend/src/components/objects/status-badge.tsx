import { Badge } from "@/components/ui/badge";

const OPERATION_STATUS_CONFIG = {
  PLAY: { label: "PLAY", variant: "default" as const },
  STOP: { label: "STOP", variant: "secondary" as const },
  REPEAT: { label: "REPEAT", variant: "outline" as const },
};

interface OperationStatusBadgeProps {
  status: "PLAY" | "STOP" | "REPEAT";
}

export function OperationStatusBadge({ status }: OperationStatusBadgeProps) {
  const config = OPERATION_STATUS_CONFIG[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

interface PowerStatusBadgeProps {
  status?: "ON" | "OFF";
}

export function PowerStatusBadge({ status }: PowerStatusBadgeProps) {
  if (!status) return <Badge variant="outline">–</Badge>;
  return (
    <Badge variant={status === "ON" ? "default" : "secondary"}>
      {status}
    </Badge>
  );
}
