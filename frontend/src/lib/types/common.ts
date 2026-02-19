export type ApiListResponse<T> = {
  items?: T[];
};

export type TimeRange = {
  start_time: string;
  end_time: string;
};

export type ErrorData = {
  boardId: string;
  boardType: string;
  errorCode: string;
};

export type PowerConsumption = {
  volt: string;
  ampere: string;
  watt: string;
};
