"use client";

import { useSyncExternalStore, useState } from "react";
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  clearLogs,
} from "@/lib/comm-log-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CommLogEntry, HttpMethod } from "@/lib/types/comm-log";

const METHOD_STYLES: Record<HttpMethod, string> = {
  GET: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  POST: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  PUT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  PATCH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  HEAD: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  OPTIONS: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

function getStatusStyle(status: number | null): string {
  if (status === null)
    return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
  if (status >= 500)
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  if (status >= 400)
    return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
  if (status >= 300)
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatDuration(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

function JsonBlock({ label, data }: { label: string; data: unknown }) {
  const isEmpty = data === undefined || data === null;
  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      {isEmpty ? (
        <p className="text-xs text-muted-foreground italic">(없음)</p>
      ) : (
        <pre className="text-xs bg-muted rounded p-2 overflow-auto max-h-48 whitespace-pre-wrap break-all">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

function CommLogRow({
  entry,
  expanded,
  onToggle,
}: {
  entry: CommLogEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasBody = entry.requestBody !== undefined || entry.responseBody !== undefined;

  return (
    <>
      <TableRow
        className={cn(
          "cursor-pointer select-none transition-colors",
          entry.isError && "bg-red-50/50 dark:bg-red-950/20",
          expanded && "bg-accent/50"
        )}
        onClick={onToggle}
      >
        <TableCell>
          <Badge
            variant="outline"
            className={cn(
              "font-mono text-xs border-0",
              METHOD_STYLES[entry.method]
            )}
          >
            {entry.method}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={cn(
              "font-mono text-xs border-0",
              getStatusStyle(entry.status)
            )}
          >
            {entry.status ?? "ERR"}
          </Badge>
        </TableCell>
        <TableCell
          className="font-mono text-xs text-foreground max-w-xs truncate"
          title={entry.url}
        >
          {entry.url}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
          {formatTime(entry.timestamp)}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground text-right whitespace-nowrap">
          {formatDuration(entry.duration)}
        </TableCell>
        <TableCell
          className="text-xs text-red-500 max-w-xs truncate"
          title={entry.errorMessage}
        >
          {entry.errorMessage ?? ""}
        </TableCell>
        <TableCell className="w-6 text-center text-muted-foreground text-xs">
          {hasBody ? (expanded ? "▲" : "▼") : ""}
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow
          className={cn(
            "hover:bg-transparent",
            entry.isError && "bg-red-50/30 dark:bg-red-950/10"
          )}
        >
          <TableCell colSpan={7} className="py-3 px-4">
            <div className="flex gap-4">
              <JsonBlock label="요청 본문" data={entry.requestBody} />
              <JsonBlock label="응답 본문" data={entry.responseBody} />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function CommLogsPage() {
  const logs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">통신 로그</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {logs.length} / 100
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearLogs();
              setExpandedId(null);
            }}
            disabled={logs.length === 0}
          >
            초기화
          </Button>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-md border bg-card py-12 text-center text-sm text-muted-foreground">
          아직 통신 내역이 없습니다.
        </div>
      ) : (
        <div className="rounded-md border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">메서드</TableHead>
                <TableHead className="w-20">상태</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="w-24">시각</TableHead>
                <TableHead className="w-24 text-right">응답시간</TableHead>
                <TableHead>오류 메시지</TableHead>
                <TableHead className="w-6" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((entry) => (
                <CommLogRow
                  key={entry.id}
                  entry={entry}
                  expanded={expandedId === entry.id}
                  onToggle={() => handleToggle(entry.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
