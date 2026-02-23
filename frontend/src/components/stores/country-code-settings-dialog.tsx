"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCountryCodes } from "@/lib/hooks/use-country-codes";

interface CountryCodeSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CountryCodeSettingsDialog({
  open,
  onOpenChange,
}: CountryCodeSettingsDialogProps) {
  const { allCodes, defaultCodes, addCode, removeCode } = useCountryCodes();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd() {
    const upper = input.trim().toUpperCase();
    if (!upper || upper.length < 2) {
      setError("2자 이상 입력하세요.");
      return;
    }
    const success = addCode(upper);
    if (!success) {
      setError("이미 존재하는 국가 코드입니다.");
      return;
    }
    setInput("");
    setError("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    if (error) setError("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>국가 코드 설정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 현재 국가 코드 목록 */}
          <div>
            <p className="text-sm font-medium mb-2">현재 국가 코드</p>
            <div className="flex flex-wrap gap-2">
              {allCodes.map((code) => {
                const isDefault = (defaultCodes as string[]).includes(code);
                return (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 rounded-md border bg-muted px-2.5 py-1 text-sm font-medium text-muted-foreground"
                  >
                    {code}
                    {!isDefault && (
                      <button
                        type="button"
                        onClick={() => removeCode(code)}
                        className="ml-0.5 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
                        title={`${code} 삭제`}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">{code} 삭제</span>
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              기본 코드({defaultCodes.join(", ")})는 삭제할 수 없습니다.
            </p>
          </div>

          {/* 국가 코드 추가 */}
          <div>
            <p className="text-sm font-medium mb-2">새 국가 코드 추가</p>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="예: VN, TH, SG"
                  maxLength={10}
                  className={error ? "border-destructive" : ""}
                />
                {error && (
                  <p className="text-xs text-destructive mt-1">{error}</p>
                )}
              </div>
              <Button type="button" onClick={handleAdd} variant="outline">
                추가
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
