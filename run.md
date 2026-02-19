# 프로젝트 실행 가이드

## 프로젝트 개요

이 프로젝트는 **Robot Monitoring 관리 대시보드**의 프론트엔드 애플리케이션입니다.
- **기술 스택**: Next.js 14+, TypeScript, React 19, Tailwind CSS, shadcn/ui
- **API 서버**: 외부 운영 (`https://robot-monitor-dev.systemiic.com/`)
- **프레임워크**: Next.js App Router (파일 기반 라우팅)

---

## 📋 개발 환경에서 실행

### 1단계: 의존성 설치

```bash
cd frontend
npm install
```

### 2단계: 환경변수 설정 (선택)

```bash
cp .env.example .env.local
# 필요시 .env.local 파일 수정 (API 기본 URL 등)
```

### 3단계: 개발 서버 실행

```bash
npm run dev
```

- **기본 URL**: `http://localhost:3000`
- **HMR 지원**: 파일 변경 시 자동 리로드
- **개발 모드 활성화**: 디버깅 도구 및 에러 메시지 표시

---

## 🔧 주요 npm 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (Hot Module Reload 지원) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run start` | 프로덕션 서버 실행 (build 필수) |
| `npm run lint` | ESLint 코드 검사 |
| `npm run gen:api-types` | OpenAPI 스펙에서 TypeScript 타입 자동 생성 |

---

## 🚀 프로덕션 배포

### A. Node.js 직접 실행

```bash
cd frontend
npm run build
npm run start
```

- **기본 포트**: 3000 (`PORT` 환경변수로 변경 가능)

### B. Docker Compose 실행 (권장)

```bash
# 1. 환경변수 설정
cp frontend/.env.example .env
# .env 파일에서 NEXT_PUBLIC_API_BASE_URL 등 설정

# 2. 이미지 빌드 & 실행
docker compose up -d --build

# 3. 로그 확인
docker compose logs -f frontend
```

- `http://서버IP:80` 으로 접속 (Nginx → Next.js)
- **API_BASE_URL 변경 시 반드시 이미지 재빌드 필요** (`NEXT_PUBLIC_*` 는 빌드 타임 번들링)

```bash
# 재빌드
docker compose build --build-arg NEXT_PUBLIC_API_BASE_URL=https://new-api.example.com frontend
docker compose up -d frontend
```

### C. GitHub Actions 자동 배포

`main` 브랜치 push 시 자동으로 이미지 빌드 → ghcr.io 푸시 → 서버 SSH 배포.

**필요한 GitHub Secrets 설정 (`Settings → Secrets → Actions`):**

| Secret | 설명 |
|--------|------|
| `NEXT_PUBLIC_API_BASE_URL` | API 서버 URL |
| `DEPLOY_HOST` | 배포 서버 IP 또는 도메인 |
| `DEPLOY_USER` | SSH 사용자명 |
| `DEPLOY_SSH_KEY` | SSH 개인키 (PEM) |

### 환경변수 설정

```bash
# .env (docker-compose 용, 커밋 금지)
NEXT_PUBLIC_API_BASE_URL=https://robot-monitor-dev.systemiic.com
# NEXT_PUBLIC_API_TOKEN=your-token
```

---

## 📦 API 타입 생성

OpenAPI 스펙(`api_doc.md`)에서 TypeScript 타입 자동 생성:

```bash
npm run gen:api-types
```

**생성 위치**: `src/lib/types/api.generated.ts`

**사용 예**:
```typescript
import { StoreResponse, PcResponse } from '@/lib/types/api.generated';
```

---

## 📂 디렉토리 구조

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── layout.tsx          # 루트 레이아웃 (사이드바, 헤더)
│   │   ├── page.tsx            # 대시보드 (/)
│   │   ├── stores/             # 매장 관리 페이지
│   │   ├── objects/            # 오브제 상세 페이지
│   │   └── globals.css         # 글로벌 스타일
│   │
│   ├── components/             # React 컴포넌트
│   │   ├── ui/                 # shadcn/ui 기본 컴포넌트
│   │   ├── layout/             # 레이아웃 컴포넌트 (사이드바, 헤더)
│   │   ├── dashboard/          # 대시보드 관련 컴포넌트
│   │   ├── stores/             # 매장 관련 컴포넌트
│   │   ├── pcs/                # PC 관련 컴포넌트
│   │   └── objects/            # 오브제 관련 컴포넌트
│   │
│   ├── lib/
│   │   ├── api/                # API 클라이언트 및 함수
│   │   │   ├── client.ts       # Axios 인스턴스 (인터셉터, 토큰 관리)
│   │   │   ├── stores.ts       # 매장 API 함수
│   │   │   ├── pcs.ts          # PC API 함수
│   │   │   └── objects.ts      # 오브제 API 함수
│   │   ├── hooks/              # 커스텀 React 훅
│   │   │   ├── use-stores.ts   # 매장 TanStack Query 훅
│   │   │   ├── use-pcs.ts      # PC TanStack Query 훅
│   │   │   ├── use-objects.ts  # 오브제 TanStack Query 훅
│   │   │   └── use-sse.ts      # SSE 커스텀 훅
│   │   ├── types/              # TypeScript 타입 정의
│   │   │   ├── api.generated.ts # OpenAPI 자동 생성 타입
│   │   │   ├── store.ts        # 매장 타입
│   │   │   ├── pc.ts           # PC 타입
│   │   │   ├── object.ts       # 오브제 타입
│   │   │   └── common.ts       # 공통 타입
│   │   └── utils/              # 유틸리티 함수
│   │       ├── format.ts       # 날짜/시간 포맷팅
│   │       └── constants.ts    # 상수 정의
│   │
│   └── providers/              # React Provider
│       └── query-provider.tsx   # TanStack Query Provider
│
├── public/                     # 정적 파일 (이미지, 폰트 등)
├── .env.example                # 환경변수 템플릿
├── package.json                # 프로젝트 메타데이터 및 스크립트
├── tsconfig.json               # TypeScript 설정
├── next.config.ts              # Next.js 설정
└── tailwind.config.ts          # Tailwind CSS 설정
```

---

## 🔗 중요 URL 및 링크

| 항목 | URL |
|------|-----|
| **API 베이스 URL** | `https://robot-monitor-dev.systemiic.com/` |
| **Swagger UI** | `https://robot-monitor-dev.systemiic.com/v1/swagger-ui/index.html?urls.primaryName=service` |
| **API 스펙** | OpenAPI 3.1.0 |

---

## 💡 개발 팁

### 1. 로컬 개발 시 API 프록시 설정

Next.js API Route를 이용한 프록시 설정:
```typescript
// src/app/api/[...path]/route.ts
export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const response = await fetch(`https://robot-monitor-dev.systemiic.com/${params.path.join('/')}`);
  return response;
}
```

### 2. 환경변수 관리

```bash
# 개발 환경 (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# 프로덕션 환경 (.env.production)
NEXT_PUBLIC_API_BASE_URL=https://robot-monitor-dev.systemiic.com
```

### 3. TypeScript 타입 자동 생성

API 스펙 변경 후:
```bash
npm run gen:api-types
```

생성된 타입 파일을 import하여 사용합니다.

### 4. ESLint 검사

```bash
npm run lint               # 전체 검사
npm run lint -- --fix     # 자동 수정 가능한 오류 수정
```

---

## 🐛 트러블슈팅

### 포트 3000이 이미 사용 중인 경우

```bash
npm run dev -- -p 3001   # 포트 3001로 변경
```

### 캐시 문제 발생 시

```bash
rm -rf .next node_modules
npm install
npm run dev
```

### API 연결 문제

1. `api_doc.md`의 API 베이스 URL 확인
2. `.env.local` 파일의 API URL 설정 확인
3. CORS 설정 확인 (필요 시 프록시 설정)
4. 네트워크 요청 상태 확인 (브라우저 개발자 도구 > Network 탭)

---

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- 프로젝트 구현 계획: `plan.md`
- API 문서: `api_doc.md`

---

**마지막 업데이트**: 2026-02-19
