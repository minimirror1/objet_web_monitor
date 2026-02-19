import axios from "axios";

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

export type ApiErrorShape = {
  message?: string;
  status?: number;
};
