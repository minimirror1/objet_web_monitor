import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 최소 이미지를 위한 standalone 출력 모드
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // 다른 PC에서 개발 서버에 접속할 때 cross-origin 경고 억제
  allowedDevOrigins: ["172.10.3.188"],

  // /proxy/* 는 src/app/proxy/[...path]/route.ts (Route Handler)가 처리합니다.
  // rewrites()로 직접 전달하면 브라우저의 Origin 헤더가 그대로 API 서버에 전달되어
  // Spring Security CORS 검사에서 403이 발생하므로 Route Handler 방식으로 전환했습니다.

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unpkg.com",
      },
    ],
  },
};

export default nextConfig;
