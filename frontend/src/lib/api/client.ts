import axios, { type InternalAxiosRequestConfig } from "axios";
import { addLog } from "@/lib/comm-log-store";
import type { HttpMethod } from "@/lib/types/comm-log";

// Axios config에 타이밍 측정용 metadata 필드 추가
declare module "axios" {
  interface InternalAxiosRequestConfig {
    metadata?: { startTime: number };
  }
}

// 브라우저에서 직접 API 서버로 요청하면 CORS 차단됨.
// Next.js rewrite(/proxy → API 서버)를 통해 same-origin 요청으로 우회.
const baseURL = "/proxy";

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_SKIP_VALUE = "__skip__";

// 인증 토큰 첨부
apiClient.interceptors.request.use((config) => {
  // localStorage 저장 토큰 우선, 없으면 .env 값 사용
  const token =
    (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null) ??
    process.env.NEXT_PUBLIC_API_TOKEN;

  // "인증 없이 계속" 상태이면 헤더 미첨부
  if (token && token !== AUTH_SKIP_VALUE) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 요청 시작 시각 기록
apiClient.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

// 응답 로그 기록
apiClient.interceptors.response.use(
  (response) => {
    const startTime = response.config.metadata?.startTime ?? Date.now();
    const duration = Date.now() - startTime;
    const url = (response.config.url ?? "").replace(/^\/proxy/, "");

    addLog({
      timestamp: new Date(),
      method: (response.config.method?.toUpperCase() ?? "GET") as HttpMethod,
      url,
      status: response.status,
      duration,
      isError: response.status >= 400,
    });

    return response;
  },
  (error) => {
    const config = error.config as InternalAxiosRequestConfig | undefined;
    const startTime = config?.metadata?.startTime ?? Date.now();
    const duration = Date.now() - startTime;
    const url = (config?.url ?? "").replace(/^\/proxy/, "");
    const status: number | null = error.response?.status ?? null;
    const errorMessage: string =
      error.response?.data?.message ?? error.message ?? "Unknown error";

    addLog({
      timestamp: new Date(),
      method: (config?.method?.toUpperCase() ?? "GET") as HttpMethod,
      url,
      status,
      duration,
      isError: true,
      errorMessage,
    });

    throw error;
  }
);

export type ApiErrorShape = {
  message?: string;
  status?: number;
};
