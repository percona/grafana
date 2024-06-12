export interface CheckUpdatesBody {
  force: boolean;
  only_installed_version?: boolean;
}

export interface VersionInfo {
  version?: string;
  full_version?: string;
  timestamp: string;
}

export interface CheckUpdatesResponse {
  installed?: VersionInfo;
  latest?: VersionInfo;
  update_available?: boolean;
  latest_news_url?: string;
  last_check?: string;
}
