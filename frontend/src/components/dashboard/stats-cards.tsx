import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: number | string;
  isLoading?: boolean;
  accent?: "default" | "green" | "red" | "yellow";
}

const ACCENT_CLASSES = {
  default: "text-foreground",
  green: "text-green-600",
  red: "text-red-600",
  yellow: "text-yellow-600",
};

function StatCard({ label, value, isLoading, accent = "default" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {isLoading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className={`text-2xl font-bold ${ACCENT_CLASSES[accent]}`}>{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  totalStores: number;
  totalPcs: number;
  totalObjects: number;
  totalErrors: number;
  isLoading: boolean;
  loadedCount: number;
  totalCountryCodes: number;
}

export function StatsCards({
  totalStores,
  totalPcs,
  totalObjects,
  totalErrors,
  isLoading,
  loadedCount,
  totalCountryCodes,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        label={
          isLoading ? `매장 (${loadedCount}/${totalCountryCodes} 로드 중)` : "총 매장"
        }
        value={totalStores}
        isLoading={isLoading}
      />
      <StatCard label="총 PC" value={totalPcs} isLoading={isLoading} />
      <StatCard label="총 오브제" value={totalObjects} isLoading={isLoading} />
      <StatCard
        label="에러"
        value={totalErrors}
        isLoading={isLoading}
        accent={totalErrors > 0 ? "red" : "default"}
      />
    </div>
  );
}
