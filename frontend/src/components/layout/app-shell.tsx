"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/providers/auth-provider";

const PUBLIC_PATHS = ["/login"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, isReady } = useAuth();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!isReady) return;
    if (!token && !isPublic) router.replace("/login");
    if (token && isPublic) router.replace("/");
  }, [isReady, token, isPublic, router]);

  // 로그인 페이지: 사이드바/헤더 없이 전체 화면
  if (isPublic) return <>{children}</>;

  // 토큰 확인 전 또는 미인증 → 빈 화면 (리다이렉트 중)
  if (!isReady || !token) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <Header />
        {children}
      </div>
    </div>
  );
}
