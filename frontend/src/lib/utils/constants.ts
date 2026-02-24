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

export const OPERATION_STATUS = ["PLAY", "STOP", "REPEAT"] as const;

export const POWER_STATUS = ["ON", "OFF"] as const;
