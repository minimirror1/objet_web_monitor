import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center p-6">
      <p className="text-8xl font-bold text-muted-foreground/30">404</p>
      <p className="text-xl font-medium text-foreground">페이지를 찾을 수 없습니다</p>
      <p className="text-sm text-muted-foreground max-w-sm">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
