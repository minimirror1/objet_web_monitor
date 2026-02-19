import { Badge } from "@/components/ui/badge";
import type { ErrorData } from "@/lib/types/common";

interface ErrorListProps {
  errors: ErrorData[];
}

export function ErrorList({ errors }: ErrorListProps) {
  if (errors.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">에러 데이터가 없습니다.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">보드 ID</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">보드 타입</th>
            <th className="text-left py-2 px-3 font-medium text-muted-foreground">에러 코드</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((err, idx) => (
            <tr key={idx} className="border-b last:border-0 hover:bg-accent">
              <td className="py-2 px-3 font-mono text-xs">{err.boardId}</td>
              <td className="py-2 px-3">{err.boardType}</td>
              <td className="py-2 px-3">
                <Badge variant="destructive" className="text-xs">
                  {err.errorCode}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
