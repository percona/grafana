import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PerconaHelpCenterState {
  isOpened: boolean;
}

const helpCenterInitialState: PerconaHelpCenterState = {
  isOpened: false,
};

const perconaHelpCenterSlice = createSlice({
  name: 'perconaHelpCenter',
  initialState: helpCenterInitialState,
  reducers: {
    setHelpCenterOpened: (state, action: PayloadAction<boolean>): PerconaHelpCenterState => ({
      ...state,
      isOpened: action.payload,
    }),
  },
});

export const { setHelpCenterOpened } = perconaHelpCenterSlice.actions;

export const helpCenterReducer = perconaHelpCenterSlice.reducer;
