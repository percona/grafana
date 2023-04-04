import { createSlice } from '@reduxjs/toolkit';

import { withSerializedError } from 'app/features/alerting/unified/utils/redux';
import { TeamService } from 'app/percona/shared/services/team/Team.service';
import { createAsyncThunk } from 'app/types';

import { TeamDetail, TeamState } from './team.types';
import { toDetailMap, toTeamDetail } from './team.utils';

export const initialState: TeamState = {
  isLoading: false,
  details: [],
  detailsMap: {},
};

const teamSlice = createSlice({
  name: 'perconaTeam',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTeamDetailsAction.pending, (state) => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(fetchTeamDetailsAction.rejected, (state) => ({
      ...state,
      isLoading: false,
    }));

    builder.addCase(fetchTeamDetailsAction.fulfilled, (state, action) => ({
      ...state,
      details: action.payload,
      detailsMap: toDetailMap(action.payload),
      isLoading: false,
    }));
  },
});

export const fetchTeamDetailsAction = createAsyncThunk(
  'percona/fetchTeamDetails',
  (): Promise<TeamDetail[]> =>
    withSerializedError(
      (async () => {
        const response = await TeamService.listDetails();
        return response.teams.map(toTeamDetail);
      })()
    )
);

export default teamSlice.reducer;
