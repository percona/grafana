import { TeamDetail } from './team.types';

export const toDetailMap = (details: TeamDetail[]): Record<number, TeamDetail> =>
  details.reduce(
    (prev, curr) => ({
      ...prev,
      [curr.teamId]: curr,
    }),
    {}
  );
