import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { StoreState } from 'app/types';

import { setAlertingTourCompleted, setProductTourCompleted } from '../user/user';

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
    resetTour: (state) => ({
      ...state,
      isOpen: false,
      tour: undefined,
    }),
  },
});

export const endTourAction = createAsyncThunk('percona/endTour', (_, { dispatch, getState }) => {
  /* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */
  const { tour } = (getState() as StoreState).percona.tour;

  if (tour === TourType.Product) {
    dispatch(setProductTourCompleted(true));
  } else if (tour === TourType.Alerting) {
    dispatch(setAlertingTourCompleted(true));
  }

  dispatch(tourSlice.actions.resetTour());
});

export const { setSteps, startTour } = tourSlice.actions;

export default tourSlice.reducer;