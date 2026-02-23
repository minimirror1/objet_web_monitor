"use client";

import { useState } from "react";
import { COUNTRY_CODES } from "@/lib/utils/constants";

const DEFAULT_CODES = [...COUNTRY_CODES];
const STORAGE_KEY = "custom_country_codes";

export function useCountryCodes() {
  const [extra, setExtra] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const allCodes = [...DEFAULT_CODES, ...extra];

  function addCode(code: string) {
    const upper = code.trim().toUpperCase();
    if (!upper || upper.length < 2 || allCodes.includes(upper)) return false;
    const next = [...extra, upper];
    setExtra(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return true;
  }

  function removeCode(code: string) {
    if ((DEFAULT_CODES as string[]).includes(code)) return;
    const next = extra.filter((c) => c !== code);
    setExtra(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return { allCodes, defaultCodes: DEFAULT_CODES, extraCodes: extra, addCode, removeCode };
}
