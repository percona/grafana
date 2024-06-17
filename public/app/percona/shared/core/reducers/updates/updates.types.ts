export interface UpdateInformation {
  version?: string;
  fullVersion?: string;
  timestamp?: string;
}

export interface UpdatesState {
  isLoading: boolean;
  updateAvailable?: boolean;
  installed?: UpdateInformation;
  latest?: UpdateInformation;
  latestNewsUrl?: string;
  lastChecked?: string;
}

export interface CheckUpdatesPayload {
  installed?: UpdateInformation;
  latest?: UpdateInformation;
  latestNewsUrl?: string;
  lastChecked?: string;
  updateAvailable: boolean;
}
