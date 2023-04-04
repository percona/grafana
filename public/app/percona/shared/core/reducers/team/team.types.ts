export interface TeamState {
  isLoading: boolean;
  details: TeamDetail[];
  detailsMap: Record<number, TeamDetail>;
}

export interface TeamDetail {
  teamId: number;
  roleIds: number[];
}
