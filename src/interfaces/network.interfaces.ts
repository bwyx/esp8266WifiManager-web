export interface INetwork {
  rssi: number;
  ssid: string;
  bssid: string;
  channel: number;
  secure: number;
  hidden: boolean;
}

export interface IForm extends INetwork {
  psk?: string;
}
