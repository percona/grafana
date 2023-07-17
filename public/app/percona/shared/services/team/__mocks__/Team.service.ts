import * as teamService from '../Team.service';

export const { TeamService } = jest.genMockFromModule<typeof teamService>('../Team.service');

TeamService.listDetails = () =>
  Promise.resolve({
    teams: [],
  });
