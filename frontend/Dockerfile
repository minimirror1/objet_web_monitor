# ===== Stage 1: 의존성 설치 =====
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev


# ===== Stage 2: 빌드 =====
FROM node:20-alpine AS builder
WORKDIR /app

# 빌드 시 필요한 환경변수 (NEXT_PUBLIC_* 는 빌드 타임에 번들에 포함됨)
ARG NEXT_PUBLIC_API_BASE_URL=https://robot-monitor-dev.systemiic.com
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


# ===== Stage 3: 실행 (최소 이미지) =====
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 전용 비루트 사용자 생성
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# standalone 빌드 결과물만 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
