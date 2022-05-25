export interface Event {
  actor: string;
  event: string;
  npa_status: string;
  status: string;
  timestamp: number;
}

export interface DeviceUser {
  _id: string;
  device_classification_status: string;
  last_event: Event;
  user_added_time: number;
  user_source: string;
  user_state: number;
  userkey: string;
  username: string;
}

export interface UserConfig {
  email: string;
  brandingdata: {
    AddonCheckerHost: string;
    AddonCheckerResponseCode: string;
    AddonManagerHost: string;
    EncryptBranding: boolean;
    OrgKey: string;
    OrgName: string;
    SFCheckerHost: string;
    SFCheckerIP: string;
    UserEmail: string;
    UserKey: string;
  };
}

export interface AppInstance {
  app: string;
  instance_name: string;
  instance_id: string;
  type: string;
  tags: any[];
  last_modified: string;
}

export interface Host {
  device_make: string;
  device_model: string;
  hostname: string;
  managementID: string;
  nsdeviceuid: string;
  os: string;
  os_version: string;
}

export interface Device {
  attributes: {
    _id: string;
    client_install_time: number;
    client_version: string;
    device_id: string;
    host_info: Host;
    last_event: Event;
    users: DeviceUser[];
  };
}

export interface ErrorPayload {
  status: 'error';
  errorCode: string;
  errors: string[];
  warnings?: string[];
}

export type SuccessPayload<T> = { status: 'success'; msg: string; data: T };

export type NetskopeResponse<T> = SuccessPayload<T> | ErrorPayload;
