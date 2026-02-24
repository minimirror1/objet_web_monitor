export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type CommLogEntry = {
  /** crypto.randomUUID()로 생성되는 고유 식별자 */
  id: string;
  /** 요청 시작 시각 */
  timestamp: Date;
  /** HTTP 메서드 */
  method: HttpMethod;
  /** /proxy prefix 제거 후의 API 경로 */
  url: string;
  /** HTTP 상태 코드. 네트워크 오류(서버 미응답)는 null */
  status: number | null;
  /** 요청 시작부터 응답까지 소요 시간 (ms) */
  duration: number;
  /** 에러 여부 (status >= 400 또는 네트워크 오류) */
  isError: boolean;
  /** 오류 메시지 (isError === true일 때만 존재) */
  errorMessage?: string;
};
