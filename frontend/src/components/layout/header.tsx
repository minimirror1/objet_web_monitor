"use client";

import { useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";

export function Header() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between shrink-0 border-b bg-card px-4 py-3">
      {/* 모바일: 햄버거 메뉴 */}
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 p-4">
            <SheetTitle className="text-sm font-semibold mb-4 text-foreground">
              Robot Monitoring
            </SheetTitle>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <span className="text-sm font-semibold text-foreground">
          Server Manager
        </span>
      </div>

      {/* 우측 액션 */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleTheme} title="테마 전환">
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="sm" onClick={logout}>
          로그아웃
        </Button>
      </div>
    </header>
  );
}
