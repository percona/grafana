import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import tipsData from '../../components/HelpCenter/components/TipsContainer/data/tips.json';

export interface TipsState {
  loading: boolean;
  tips: Tip[];
  currentlySelected: number;
}

export interface Tip {
  id: number;
  title: string;
  text: string;
  buttonText: string;
  buttonTooltipText: string;
  buttonIcon?: string;
  url: string;
  completed: boolean;
}

const initialTipsState: TipsState = {
  loading: false,
  tips: [],
  currentlySelected: 0,
};

const perconaTipsSlice = createSlice({
  name: 'perconaTips',
  initialState: initialTipsState,
  reducers: {
    setTips: (state, action: PayloadAction<Tip[]>): TipsState => {
      return {
        ...state,
        tips: action.payload,
        loading: false,
      };
    },
    setTipsLoading: (state): TipsState => {
      return {
        ...state,
        loading: true,
      };
    },
    setCurrentlySelected: (state, action: PayloadAction<number>): TipsState => {
      return {
        ...state,
        currentlySelected: action.payload,
      };
    },
  },
});

export const fetchTipsAction = createAsyncThunk(
  'percona/fetchTips',
  (args: {}, thunkAPI): Promise<void> =>
    (async () => {
      thunkAPI.dispatch(setTipsLoading());
      const requestPromise = new Promise<Tip[]>((resolve) => {
        setTimeout(() => {
          resolve(tipsData);
        }, 5000);
      });
      const promiseResults = await requestPromise;
      thunkAPI.dispatch(setTips(promiseResults));
      const notCompletedTip = promiseResults.find((tipData) => !tipData.completed);
      const initial = notCompletedTip !== undefined ? notCompletedTip.id : 0;
      thunkAPI.dispatch(setCurrentlySelected(initial));
    })()
);

export const { setTips, setTipsLoading, setCurrentlySelected } = perconaTipsSlice.actions;
export default perconaTipsSlice.reducer;
