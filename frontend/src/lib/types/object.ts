import type { ErrorData, PowerConsumption, TimeRange } from "@/lib/types/common";

export type FirmwareVersion = {
  board_id: string;
  board_type: string;
  version: string;
};

export type ObjectItem = {
  id: string;
  object_name: string;
  operation_status: "PLAY" | "STOP" | "REPEAT";
  schedule_flag: boolean;
  power_status?: "ON" | "OFF";
  power_consumption?: PowerConsumption;
  error_data?: ErrorData[];
};

export type ObjectDetail = ObjectItem & {
  firmware_version?: FirmwareVersion;
  object_operation_time?: TimeRange;
  created_at?: string;
  modified_at?: string;
};

export type ObjectCreateRequest = {
  object_name: string;
  object_operation_time: TimeRange;
  schedule_flag: boolean;
  firmware_version: FirmwareVersion;
  operation_status: "PLAY" | "STOP" | "REPEAT";
};

export type ObjectUpdateRequest = {
  object_name?: string;
  object_operation_time?: TimeRange;
  schedule_flag?: boolean;
  firmware_version?: FirmwareVersion;
  operation_status?: "PLAY" | "STOP" | "REPEAT";
};

export type ObjectCreateResponse = {
  id: string;
  created_at: string;
};

export type ObjectPowerControlRequest = {
  power_status: "ON" | "OFF";
};

export type ObjectLogRequest = {
  log_data: string;
};

export type ObjectLogResponse = {
  success: boolean;
};
