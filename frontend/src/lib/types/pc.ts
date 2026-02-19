export type Pc = {
  store_id: string;
  pc_id: string;
  pc_name: string;
  sw_version: string;
  created_at: string;
  modified_at?: string;
};

export type PcCreateRequest = {
  pc_name: string;
  sw_version: string;
};

export type PcUpdateRequest = {
  pc_name?: string;
  sw_version?: string;
};

export type PcAddResponse = {
  store_id: string;
  pc_id: string;
  created_at: string;
};
