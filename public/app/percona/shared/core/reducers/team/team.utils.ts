import { TeamListItemResponse } from 'app/percona/shared/services/team/Team.types';

import { TeamDetail } from './team.types';

export const toTeamDetail = (item: TeamListItemResponse): TeamDetail => ({
  teamId: item.team_id,
  roleIds: item.role_ids,
});

export const toDetailMap = (details: TeamDetail[]): Record<number, TeamDetail> =>
  details.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.teamId]: curr,
    }),
    {}
  );
