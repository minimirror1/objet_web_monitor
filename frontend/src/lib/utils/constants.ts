export const COUNTRIES = [
  { code: "KR", name: "대한민국",     timezone: "Asia/Seoul" },
  { code: "CN", name: "중국",         timezone: "Asia/Shanghai" },
  { code: "JP", name: "일본",         timezone: "Asia/Tokyo" },
  { code: "TW", name: "대만",         timezone: "Asia/Taipei" },
  { code: "HK", name: "홍콩",         timezone: "Asia/Hong_Kong" },
  { code: "SG", name: "싱가포르",     timezone: "Asia/Singapore" },
  { code: "US", name: "미국",         timezone: "America/New_York" },
  { code: "CA", name: "캐나다",       timezone: "America/Toronto" },
  { code: "AE", name: "아랍에미리트", timezone: "Asia/Dubai" },
  { code: "GB", name: "영국",         timezone: "Europe/London" },
  { code: "AU", name: "호주",         timezone: "Australia/Sydney" },
  { code: "TH", name: "태국",         timezone: "Asia/Bangkok" },
  { code: "PH", name: "필리핀",       timezone: "Asia/Manila" },
  { code: "MY", name: "말레이시아",   timezone: "Asia/Kuala_Lumpur" },
  { code: "MO", name: "마카오",       timezone: "Asia/Macau" },
  { code: "IT", name: "이탈리아",     timezone: "Europe/Rome" },
  { code: "FR", name: "프랑스",       timezone: "Europe/Paris" },
] as const;

export type CountryCode = typeof COUNTRIES[number]["code"];

export const COUNTRY_CODES = COUNTRIES.map((c) => c.code);

export const WORLD_VIEW = { longitude: 10, latitude: 20, zoom: 1 };

export const COUNTRY_VIEWS: Record<string, { longitude: number; latitude: number; zoom: number }> = {
  KR:       { longitude: 127.5,   latitude:  36.5,  zoom:  6 },
  "KR-SEOUL": { longitude: 126.978, latitude:  37.566, zoom: 10 },
  CN: { longitude: 104.0, latitude:  35.0, zoom:  3 },
  JP: { longitude: 138.0, latitude:  36.0, zoom:  5 },
  TW: { longitude: 121.0, latitude:  23.5, zoom:  6.5 },
  HK: { longitude: 114.2, latitude:  22.3, zoom:  9 },
  SG: { longitude: 103.8, latitude:   1.4, zoom: 10 },
  US: { longitude: -98.5, latitude:  39.5, zoom:  3.5 },
  CA: { longitude: -96.0, latitude:  55.0, zoom:  3 },
  AE: { longitude:  54.0, latitude:  24.0, zoom:  6 },
  GB: { longitude:  -2.0, latitude:  54.0, zoom:  5 },
  AU: { longitude: 133.0, latitude: -27.0, zoom:  3.5 },
  TH: { longitude: 101.0, latitude:  15.0, zoom:  5 },
  PH: { longitude: 122.0, latitude:  12.0, zoom:  5 },
  MY: { longitude: 109.7, latitude:   4.2, zoom:  5 },
  MO: { longitude: 113.5, latitude:  22.2, zoom: 10 },
  IT: { longitude:  12.5, latitude:  41.9, zoom:  5 },
  FR: { longitude:   2.3, latitude:  46.2, zoom:  5 },
};

export const OPERATION_STATUS = ["PLAY", "STOP", "REPEAT"] as const;

export const POWER_STATUS = ["ON", "OFF"] as const;
