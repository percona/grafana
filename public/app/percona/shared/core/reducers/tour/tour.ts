import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { setProductTourCompleted } from '../user';

import { SetStepsActionPayload, TourState, TourType } from './tour.types';

const initialState: TourState = {
  isOpen: false,
  steps: {
    [TourType.Alerting]: [],
    [TourType.Product]: [],
  },
};

const tourSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    setSteps: (state, { payload }: PayloadAction<SetStepsActionPayload>) => ({
      ...state,
      steps: {
        ...state.steps,
        [payload.tour]: payload.steps,
      },
    }),
    startTour: (state, { payload }: PayloadAction<TourType>) => ({
      ...state,
      isOpen: true,
      tour: payload,
    }),
  },
});

export const endTourAction = createAsyncThunk('percona/endTour', (tour: TourType, { dispatch }) => {
  console.log('Ending tour - ', tour);

  if (tour === TourType.Product) {
    dispatch(setProductTourCompleted(true));
  } else if (tour === TourType.Alerting) {
    dispatch(setProductTourCompleted(true));
  }
});

export const { setSteps, startTour } = tourSlice.actions;

export default tourSlice.reducer;
