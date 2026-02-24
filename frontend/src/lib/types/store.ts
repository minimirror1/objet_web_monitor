export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export const DAYS_OF_WEEK: DayOfWeek[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export type StoreOperateTime = {
  day_of_week: DayOfWeek;
  open_time: string;
  close_time: string;
};

export type Store = {
  id: string;
  store_name: string;
  country_code: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  operate_times?: StoreOperateTime[];
  created_at: string;
  modified_at: string;
};

export type PcWithObjects = {
  pc_id: string;
  pc_name: string;
  sw_version: string;
  objects: ObjectSummary[];
  created_at: string;
  modified_at: string;
};

export type ObjectSummary = {
  id: string;
  object_name: string;
  power_status?: "ON" | "OFF";
  operation_status?: "PLAY" | "STOP" | "REPEAT";
  schedule_flag?: boolean;
  error_data?: { boardId: string; boardType: string; errorCode: string }[];
};

export type StoreDetail = {
  store_id: string;
  store_name: string;
  country_code: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  operate_times: StoreOperateTime[];
  pcs: PcWithObjects[];
  created_at: string;
  modified_at: string;
};

export type StoreCreateRequest = {
  store_name: string;
  country_code: string;
  address: string;
  latitude: number;
  longitude: number;
  timezone: string;
  operate_times: StoreOperateTime[];
};

export type StoreUpdateRequest = {
  store_name?: string;
  country_code?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  operate_times?: StoreOperateTime[];
};

