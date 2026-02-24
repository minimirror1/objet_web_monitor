export type MapStore = {
  id: string;
  store_name: string;
  latitude: number;
  longitude: number;
  address?: string;
  /** error_data.length > 0 인 오브제가 존재하는 매장 */
  hasError: boolean;
  /** power_status === "OFF" 인 오브제가 존재하는 매장 */
  hasPowerOff: boolean;
};
