# Robot Monitoring 관리 대시보드 - 구현 계획서

## 프로젝트 개요

젠틀몬스터 매장에 설치된 오브제(애니매트로닉스)의 상태를 모니터링하고 관리하는 웹 대시보드.
매장 → PC → 오브제 3단계 계층 구조의 CRUD 및 실시간 모니터링 기능을 제공한다.

- **API 서버**: `https://robot-monitor-dev.systemiic.com/`
- **API 문서**: [Swagger UI](https://robot-monitor-dev.systemiic.com/v1/swagger-ui/index.html?urls.primaryName=service)
- **API 스펙**: OpenAPI 3.1.0

---

## 기술 스택

| 영역 | 기술 | 버전 | 비고 |
|------|------|------|------|
| 프레임워크 | Next.js (App Router) | 14+ | 파일 기반 라우팅, SSR/CSR |
| 언어 | TypeScript | strict | OpenAPI 타입 자동 생성 |
| UI 컴포넌트 | shadcn/ui | latest | Radix 기반, Tailwind 스타일 |
| 스타일링 | Tailwind CSS | 4 | 유틸리티 클래스 |
| API 상태관리 | TanStack Query | v5 | 캐싱, 리페치, 뮤테이션 |
| HTTP 클라이언트 | Axios | latest | 인터셉터, 토큰 관리 |
| 차트 | Recharts | latest | 대시보드 시각화 |
| 지도 | react-leaflet | latest | 매장 위치 표시 |
| SSE | EventSource (네이티브) | - | PC 헬스, 오브제 전원 실시간 |
| 아이콘 | Lucide React | latest | shadcn/ui 기본 아이콘 |

---

## 데이터 모델 (API 기반)

### 계층 구조

```
Store (매장)
 ├── store_id, store_name, country_code, address, lat/lng, timezone
 ├── operate_times[] (요일별 운영시간)
 │
 └── PC[]
      ├── pc_id, pc_name, sw_version
      │
      └── Object[] (오브제)
           ├── id, object_name
           ├── power_status (ON/OFF)
           ├── operation_status (PLAY/STOP/REPEAT)
           ├── schedule_flag (boolean)
           ├── firmware_version (board_id, board_type, version)
           ├── object_operation_time (start_time, end_time)
           ├── power_consumption (volt, ampere, watt)
           └── error_data[] (boardId, boardType, errorCode)
```

---

## 페이지 구조 및 라우팅

```
app/
├── layout.tsx                              # 공통 레이아웃 (사이드바 + 헤더)
├── page.tsx                                # 대시보드 (메인)
│
├── stores/
│   ├── page.tsx                            # 매장 목록
│   ├── new/page.tsx                        # 매장 등록
│   └── [storeId]/
│       ├── page.tsx                        # 매장 상세 (PC+오브제 트리)
│       ├── edit/page.tsx                   # 매장 수정
│       │
│       └── pcs/
│           ├── new/page.tsx                # PC 등록
│           └── [pcId]/
│               ├── page.tsx                # PC 상세 (오브제 목록 + 헬스)
│               ├── edit/page.tsx           # PC 수정
│               │
│               └── objects/
│                   └── new/page.tsx        # 오브제 등록
│
├── objects/
│   └── [objectId]/
│       ├── page.tsx                        # 오브제 상세 (상태 + 전원 제어)
│       └── edit/page.tsx                   # 오브제 수정
│
└── not-found.tsx                           # 404 페이지
```

---

## 구현 단계

### Phase 1: 프로젝트 초기 설정

- [x] Next.js + TypeScript 프로젝트 생성
- [x] Tailwind CSS 설정
- [x] shadcn/ui 초기화 및 기본 컴포넌트 설치
  - Button, Card, Table, Dialog, Form, Input, Select, Badge, Tabs, Sheet, Dropdown Menu, Toast, Skeleton
- [x] 프로젝트 디렉토리 구조 생성
- [x] Axios 인스턴스 설정 (baseURL, 인터셉터, 토큰 관리)
- [x] OpenAPI 스펙 기반 TypeScript 타입 정의
- [x] TanStack Query Provider 설정
- [x] 공통 레이아웃 (사이드바 + 헤더) 구현

### Phase 2: 매장(Store) 관리

- [x] 매장 목록 페이지
  - 국가별 필터 (country_code)
  - 테이블: 매장명, 주소, 국가, 생성일
  - 등록 버튼, 행 클릭 → 상세 이동
- [x] 매장 등록 페이지
  - 폼: 매장명, 국가코드, 주소, 위도/경도, 타임존
  - 요일별 운영시간 입력 (7개 행)
  - 유효성 검증 (필수 필드, 시간 형식)
- [x] 매장 상세 페이지
  - 매장 기본 정보 카드
  - 운영시간 테이블
  - PC 목록 (하위 오브제 포함 트리 구조)
  - 수정/삭제 버튼
- [x] 매장 수정 페이지
  - 기존 데이터 프리필
  - 부분 업데이트 지원
- [x] 매장 삭제 기능
  - 확인 다이얼로그

### Phase 3: PC 관리

- [x] PC 목록 (매장 상세 페이지 내 섹션)
  - 테이블: PC명, SW 버전, 생성일, 상태
- [x] PC 등록 폼
  - PC명, SW 버전 입력
- [x] PC 상세 페이지
  - PC 기본 정보
  - 소속 오브제 목록
  - 헬스체크 상태 표시
- [x] PC 수정 (모달 또는 인라인)
- [x] PC 삭제

### Phase 4: 오브제(Object) 관리

- [ ] 오브제 목록 (PC 상세 내 섹션)
  - 카드 뷰: 이름, 전원상태, 동작상태, 에러 배지
- [ ] 오브제 등록 폼
  - 이름, 운영시간, 스케줄 플래그, 펌웨어 버전, 동작상태
- [ ] 오브제 상세 페이지
  - 기본 정보 카드
  - 상태 상세 (전원, 동작, 전력소비)
  - 에러 데이터 테이블
  - 전원 ON/OFF 제어 버튼
- [ ] 오브제 수정 (부분 업데이트)
- [ ] 오브제 삭제 (소프트 삭제)

### Phase 5: 실시간 모니터링 (SSE)

- [ ] useSSE 커스텀 훅 구현
  - 자동 재연결
  - Last-Event-ID 지원
  - 연결 상태 표시 (connected/disconnected/reconnecting)
- [ ] PC 헬스체크 실시간 모니터링
  - `GET /v1/service/stores/{store_id}/pcs/{pc_id}/health` (SSE)
  - 온라인/오프라인 상태 인디케이터
  - 연결 끊김 시 자동 재연결
- [ ] 오브제 전원 상태 실시간 수신
  - `GET /v1/service/objects/{object_id}/power` (SSE)
  - 전원 상태 변경 시 UI 즉시 반영
- [ ] 이벤트 전송 기능
  - `POST /v1/service/stores/send-event`
  - ON/OFF/REBOOT 이벤트

### Phase 6: 대시보드

- [ ] 통계 카드 (총 매장/PC/오브제 수, 에러 건수)
- [ ] 오브제 상태 분포 차트 (전원 ON/OFF 파이차트, 동작상태 바 차트)
- [ ] 매장 위치 지도 (react-leaflet, 마커 클릭 → 매장 상세 이동)
- [ ] 최근 에러 목록 테이블
- [ ] 실시간 알림 표시

### Phase 7: 부가 기능 / 폴리싱

- [ ] 인증/권한 처리 (JWT 토큰 관리, 로그인 페이지)
- [ ] 다크 모드 지원
- [ ] 반응형 레이아웃 (모바일 대응)
- [ ] 로딩 스켈레톤, 에러 바운더리
- [ ] 토스트 알림 (성공/실패 피드백)
- [ ] 검색 / 필터 / 정렬 고도화
- [ ] 빌드 최적화 및 배포 설정

---

## API 매핑 테이블

### Store (매장)

| 기능 | Method | Endpoint | Request Body | Response |
|------|--------|----------|-------------|----------|
| 매장 목록 | GET | `/v1/service/stores?country_code={code}` | - | `StoreListResponse` |
| 매장 등록 | POST | `/v1/service/stores` | `StoreCreateRequest` | `StoreCreateResponse` |
| 매장 조회 | GET | `/v1/service/stores/{store_id}` | - | `StoreResponse` |
| 매장 상세 | GET | `/v1/service/stores/{store_id}/detail` | - | `StoreDetailResponse` |
| 매장 수정 | PUT | `/v1/service/stores/{store_id}` | `StoreUpdateRequest` | `StoreUpdateResponse` |
| 매장 삭제 | DELETE | `/v1/service/stores/{store_id}` | - | `StoreDeleteResponse` |

### PC

| 기능 | Method | Endpoint | Request Body | Response |
|------|--------|----------|-------------|----------|
| PC 목록 | GET | `/v1/service/stores/{store_id}/pcs` | - | `PcListResponse` |
| PC 등록 | POST | `/v1/service/stores/{store_id}/pcs` | `PcCreateRequest` | `PcAddResponse` |
| PC 조회 | GET | `/v1/service/stores/{store_id}/pcs/{pc_id}` | - | `PcResponse` |
| PC 수정 | PUT | `/v1/service/stores/{store_id}/pcs/{pc_id}` | `PcUpdateRequest` | `PcUpdateResponse` |
| PC 삭제 | DELETE | `/v1/service/stores/{store_id}/{pc_id}` | - | `PcDeleteResponse` |
| PC 헬스 SSE | GET | `/v1/service/stores/{store_id}/pcs/{pc_id}/health` | - | SSE stream |

### Object (오브제)

| 기능 | Method | Endpoint | Request Body | Response |
|------|--------|----------|-------------|----------|
| 오브제 목록 | GET | `/v1/service/stores/{store_id}/pcs/{pc_id}/objects` | - | `ObjectResponse[]` |
| 오브제 등록 | POST | `/v1/service/stores/{store_id}/pcs/{pc_id}/objects` | `ObjectAddRequest` | `ObjectCreateResponse` |
| 오브제 조회 | GET | `/v1/service/objects/{object_id}` | - | `ObjectStatusResponse` |
| 오브제 수정 | PUT | `/v1/service/objects/{object_id}` | `ObjectUpdateRequest` | `ObjectUpdateResponse` |
| 오브제 삭제 | DELETE | `/v1/service/objects/{object_id}` | - | `ObjectDeleteResponse` |
| 전원 제어 | POST | `/v1/service/objects/{object_id}/power` | `ObjectPowerControlRequest` | `{string: boolean}` |
| 전원 SSE | GET | `/v1/service/objects/{object_id}/power` | - | SSE stream |
| 로그 전송 | POST | `/v1/service/objects/{object_id}/logs` | `ObjectLogRequest` | `ObjectLogResponse` |

### Notification

| 기능 | Method | Endpoint | Request Body | Response |
|------|--------|----------|-------------|----------|
| 이벤트 전송 | POST | `/v1/service/stores/send-event` | `StoreEventSendRequestDTO` | - |

---

## 소스 디렉토리 구조

```
src/
├── app/                          # Next.js App Router 페이지
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 대시보드
│   ├── stores/                   # 매장 관련 페이지
│   ├── objects/                  # 오브제 상세 페이지
│   └── globals.css               # 글로벌 스타일
│
├── components/
│   ├── ui/                       # shadcn/ui 컴포넌트 (자동 생성)
│   ├── layout/
│   │   ├── sidebar.tsx           # 사이드바 네비게이션
│   │   ├── header.tsx            # 상단 헤더
│   │   └── breadcrumb.tsx        # 브레드크럼
│   ├── dashboard/
│   │   ├── stats-cards.tsx       # 통계 카드
│   │   ├── status-chart.tsx      # 상태 분포 차트
│   │   ├── store-map.tsx         # 매장 지도
│   │   └── error-table.tsx       # 에러 목록
│   ├── stores/
│   │   ├── store-table.tsx       # 매장 테이블
│   │   ├── store-form.tsx        # 매장 등록/수정 폼
│   │   ├── store-detail.tsx      # 매장 상세 뷰
│   │   └── operate-time-form.tsx # 운영시간 입력
│   ├── pcs/
│   │   ├── pc-table.tsx          # PC 테이블
│   │   ├── pc-form.tsx           # PC 등록/수정 폼
│   │   └── pc-health-badge.tsx   # PC 헬스 상태 배지
│   └── objects/
│       ├── object-card.tsx       # 오브제 카드
│       ├── object-form.tsx       # 오브제 등록/수정 폼
│       ├── power-toggle.tsx      # 전원 ON/OFF 토글
│       ├── status-badge.tsx      # 동작상태 배지
│       └── error-list.tsx        # 에러 데이터 목록
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # Axios 인스턴스 + 인터셉터
│   │   ├── stores.ts             # 매장 API 함수
│   │   ├── pcs.ts                # PC API 함수
│   │   └── objects.ts            # 오브제 API 함수
│   ├── hooks/
│   │   ├── use-stores.ts         # 매장 TanStack Query 훅
│   │   ├── use-pcs.ts            # PC TanStack Query 훅
│   │   ├── use-objects.ts        # 오브제 TanStack Query 훅
│   │   └── use-sse.ts            # SSE 커스텀 훅
│   ├── types/
│   │   ├── store.ts              # 매장 관련 타입
│   │   ├── pc.ts                 # PC 관련 타입
│   │   ├── object.ts             # 오브제 관련 타입
│   │   └── common.ts             # 공통 타입
│   └── utils/
│       ├── format.ts             # 날짜/시간 포맷팅
│       └── constants.ts          # 상수 (국가코드, 상태값 등)
│
└── providers/
    └── query-provider.tsx        # TanStack Query Provider
```

---

## 주요 화면 와이어프레임

### 대시보드
```
┌──────────────────────────────────────────────────────┐
│ 🏠 대시보드                                    [🔔] │
├──────────┬───────────────────────────────────────────┤
│          │ [매장: 12] [PC: 34] [오브제: 89] [에러: 3]│
│ 대시보드  │                                          │
│ 매장 관리 │ ┌─ 상태 분포 ──┐ ┌─ 매장 지도 ─────────┐│
│ 오브제    │ │  파이차트     │ │                     ││
│          │ │  ON/OFF/에러  │ │  (Leaflet Map)      ││
│          │ └──────────────┘ └─────────────────────┘│
│          │                                          │
│          │ ┌─ 최근 에러 목록 ──────────────────────┐│
│          │ │ 오브제명 | 에러코드 | 보드 | 시간      ││
│          │ │ Robot1  | 16      | MAI  | 10분 전    ││
│          │ └────────────────────────────────────────┘│
└──────────┴───────────────────────────────────────────┘
```

### 매장 상세
```
┌──────────────────────────────────────────────────────┐
│ 매장 > GM_하우스_도산                    [수정] [삭제]│
├──────────┬───────────────────────────────────────────┤
│          │ ┌─ 매장 정보 ───────────────────────────┐│
│          │ │ 주소: 서울시 강남구...  국가: KR       ││
│          │ │ 타임존: Asia/Seoul                     ││
│          │ └───────────────────────────────────────┘│
│          │                                          │
│          │ ┌─ PC 목록 ─────────────── [+ PC 등록] ─┐│
│          │ │ ▼ 🖥️ PC001 (v10.0)           [●온라인]││
│          │ │   ├ 🤖 Robot1  [▶PLAY] [⚡ON]         ││
│          │ │   └ 🤖 Robot2  [⏹STOP] [⚡OFF]        ││
│          │ │                                       ││
│          │ │ ▶ 🖥️ PC002 (v10.0)          [○오프라인]││
│          │ └───────────────────────────────────────┘│
└──────────┴───────────────────────────────────────────┘
```

---

## 참고 사항

- **인증**: 모든 API에 `Authorization: Bearer ...` 헤더 필요 (선택적). 인증 서버/토큰 발급 방식은 별도 확인 필요.
- **CORS**: 프론트엔드와 API 서버 도메인이 다르므로 Next.js API Route를 프록시로 사용하거나, 서버 측 CORS 허용 필요.
- **소프트 삭제**: 오브제 삭제는 소프트 삭제로 동작 (API 명세 기준).
- **SSE 재연결**: 네트워크 불안정 시 자동 재연결 로직 필수 (지수 백오프).
- **타임존**: 매장별 타임존이 다르므로 시간 표시 시 해당 매장의 타임존 기준으로 변환.
