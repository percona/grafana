import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserService } from '../../../services/user/User.service';

import { PerconaUserState, UserDetails } from './user.types';
import { toUserDetailsModel } from './user.utils';

export const initialUserState: PerconaUserState = {
  userId: 0,
  isAuthorized: false,
  snoozedPmmVersion: '',
};

const perconaUserSlice = createSlice({
  name: 'perconaUser',
  initialState: initialUserState,
  reducers: {
    setAuthorized: (state, action: PayloadAction<boolean>): PerconaUserState => ({
      ...state,
      isAuthorized: action.payload,
    }),
    setUserDetails: (state, action: PayloadAction<UserDetails>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const fetchUserDetailsAction = createAsyncThunk(
  'percona/fetchUserDetails',
  async (_, thunkAPI): Promise<UserDetails> => {
    const res = await UserService.getUserDetails();
    const details = toUserDetailsModel(res);
    thunkAPI.dispatch(setUserDetails(details));
    return details;
  }
);


export const setSnoozedVersion = createAsyncThunk(
  'percona/setSnoozedVersion',
  async (version: string, thunkAPI): Promise<UserDetails> => {
    const res = await UserService.setSnoozedVersion(version);
    const details = toUserDetailsModel(res);
    thunkAPI.dispatch(setUserDetails(details));
    return details;
  }
);

export const { setAuthorized, setUserDetails } = perconaUserSlice.actions;

export default perconaUserSlice.reducer;
