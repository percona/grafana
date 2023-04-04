export interface TeamListItemResponse {
  team_id: number;
  role_ids: number[];
}

export interface TeamListResponse {
  teams: TeamListItemResponse[];
}
