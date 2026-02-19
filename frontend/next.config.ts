import type { NextConfig } from "next";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://robot-monitor-dev.systemiic.com";

const nextConfig: NextConfig = {
  // Docker 최소 이미지를 위한 standalone 출력 모드
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // 다른 PC에서 개발 서버에 접속할 때 cross-origin 경고 억제
  allowedDevOrigins: ["172.10.3.188"],

  // 브라우저 → /proxy/* → API 서버 (CORS 우회)
  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: `${API_BASE}/:path*`,
      },
    ];
  },

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
