export interface UserStatusResponse {
  is_platform_user: boolean;
}

export interface UserDetailsResponse {
  user_id: number;
  snoozed_pmm_version?: string;
}

export interface UserDetailsPutPayload {
  snoozed_pmm_version?: string;
}

export interface UserListItemResponse {
  user_id: number;
  role_ids: number[];
}

export interface UserListResponse {
  users: UserListItemResponse[];
}
