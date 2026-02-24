import type { CommLogEntry } from "@/lib/types/comm-log";

const MAX_LOGS = 100;

let logs: CommLogEntry[] = [];
const listeners = new Set<() => void>();

/** useSyncExternalStore의 subscribe 인자 */
export function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/** useSyncExternalStore의 getSnapshot 인자 */
export function getSnapshot(): CommLogEntry[] {
  return logs;
}

/** useSyncExternalStore의 getServerSnapshot 인자 - SSR hydration 불일치 방지 */
export function getServerSnapshot(): CommLogEntry[] {
  return [];
}

/** crypto.randomUUID()는 Secure Context(HTTPS/localhost)에서만 동작하므로 폴백 제공 */
function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/** 로그 추가. 최신 순 prepend, MAX_LOGS 초과 시 오래된 항목 제거 (FIFO) */
export function addLog(entry: Omit<CommLogEntry, "id">): void {
  if (typeof window === "undefined") return;

  const newEntry: CommLogEntry = {
    ...entry,
    id: generateId(),
  };

  logs = [newEntry, ...logs];
  if (logs.length > MAX_LOGS) {
    logs = logs.slice(0, MAX_LOGS);
  }

  listeners.forEach((cb) => cb());
}

/** 로그 전체 초기화 */
export function clearLogs(): void {
  logs = [];
  listeners.forEach((cb) => cb());
}
