"use client";

import { useEffect, useRef, useState } from "react";

type ConnectionState = "connected" | "disconnected" | "reconnecting";

type UseSseOptions<T> = {
  url: string;
  withCredentials?: boolean;
  parse?: (raw: string) => T;
};

export function useSse<T = string>({ url, parse }: UseSseOptions<T>) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const retryRef = useRef<number | null>(null);
  const lastEventIdRef = useRef<string>("");
  const retryDelayRef = useRef<number>(1_000); // 지수 백오프 시작값 (1초)

  useEffect(() => {
    let source: EventSource | null = null;

    const connect = () => {
      setConnectionState((prev) => (prev === "disconnected" ? "reconnecting" : prev));

      // Last-Event-ID를 쿼리 파라미터로 전달하여 재연결 시 누락 이벤트 복구
      const targetUrl = lastEventIdRef.current
        ? `${url}${url.includes("?") ? "&" : "?"}lastEventId=${encodeURIComponent(lastEventIdRef.current)}`
        : url;

      source = new EventSource(targetUrl);

      source.onopen = () => {
        setConnectionState("connected");
        retryDelayRef.current = 1_000; // 연결 성공 시 딜레이 리셋
      };

      source.onmessage = (event) => {
        if (!event.data) return;

        // 브라우저가 제공하는 lastEventId 추적
        if (event.lastEventId) {
          lastEventIdRef.current = event.lastEventId;
        }

        const value = parse ? parse(event.data) : (event.data as T);
        setLastMessage(value);
      };

      source.onerror = () => {
        setConnectionState("reconnecting");
        source?.close();

        // 지수 백오프: 1→2→4→8→16→30초 (최대 30초)
        const delay = retryDelayRef.current;
        retryDelayRef.current = Math.min(delay * 2, 30_000);

        retryRef.current = window.setTimeout(() => {
          connect();
        }, delay);
      };
    };

    connect();

    return () => {
      if (retryRef.current) {
        window.clearTimeout(retryRef.current);
      }
      source?.close();
      setConnectionState("disconnected");
    };
  }, [parse, url]);

  return { connectionState, lastMessage };
}
