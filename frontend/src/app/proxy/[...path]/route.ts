/**
 * API 프록시 Route Handler
 *
 * Next.js의 rewrites()는 브라우저의 Origin 헤더를 그대로 API 서버로 전달합니다.
 * API 서버(Spring Security)가 172.10.3.188:3000 origin을 허용하지 않아 CORS 403이 발생합니다.
 *
 * 이 Route Handler는 Origin 헤더를 제거한 뒤 API 서버로 요청을 전달하여 문제를 해결합니다.
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://robot-monitor-dev.systemiic.com";

// Origin·Host·Transfer-Encoding 등 hop-by-hop 헤더는 제거하고 전달
const SKIP_HEADERS = new Set([
  "host",
  "origin",
  "referer",
  "transfer-encoding",
  "connection",
  "keep-alive",
  "te",
  "trailer",
  "upgrade",
  "proxy-authorization",
  "proxy-authenticate",
]);

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const targetUrl = `${API_BASE}/${pathStr}${searchParams ? `?${searchParams}` : ""}`;

  // 허용된 헤더만 전달 (Origin·Host 제거)
  const forwardHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    if (!SKIP_HEADERS.has(key.toLowerCase())) {
      forwardHeaders[key] = value;
    }
  });

  const isBodyMethod = !["GET", "HEAD"].includes(request.method.toUpperCase());
  const body = isBodyMethod ? await request.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers: forwardHeaders,
    body: body ? Buffer.from(body) : undefined,
  });

  const contentType = upstream.headers.get("content-type") ?? "application/json";
  const responseHeaders = new Headers({ "Content-Type": contentType });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
