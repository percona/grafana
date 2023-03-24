import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import systemTipsData from '../../components/HelpCenter/components/TipsContainer/data/systemTips.json';
import userTipsData from '../../components/HelpCenter/components/TipsContainer/data/userTips.json';
import { apiOnboarding } from '../../shared/api';

export interface AllTipsState {
  systemTips: TipsState;
  userTips: TipsState;
}

export interface TipsState {
  loading: boolean;
  tips: TipModel[];
  currentlySelected: number;
}

export interface TipModel {
  id: number;
  title: string;
  text: string;
  buttonText: string;
  buttonTooltipText: string;
  buttonIcon?: string;
  url: string;
  completed: boolean;
}

const initialTipsState: AllTipsState = {
  userTips: {
    // @ts-ignore
    tips: systemTipsData,
    currentlySelected: 0,
    loading: false,
  },
  systemTips: {
    // @ts-ignore
    tips: userTipsData,
    currentlySelected: 0,
    loading: true,
  },
};

const perconaTipsSlice = createSlice({
  name: 'perconaTips',
  initialState: initialTipsState,
  reducers: {
    setSystemTips: (state, action: PayloadAction<TipModel[]>): AllTipsState => {
      return {
        ...state,
        systemTips: {
          ...state.systemTips,
          tips: action.payload,
          loading: false,
        },
      };
    },
    setUserTips: (state, action: PayloadAction<TipModel[]>): AllTipsState => {
      return {
        ...state,
        userTips: {
          ...state.userTips,
          tips: action.payload,
          loading: false,
        },
      };
    },
    setSystemTipsLoading: (state): AllTipsState => {
      return {
        ...state,
        systemTips: {
          ...state.systemTips,
          loading: true,
        },
      };
    },
    setUserTipsLoading: (state): AllTipsState => {
      return {
        ...state,
        userTips: {
          ...state.userTips,
          loading: true,
        },
      };
    },
    setSystemTipsCurrentlySelected: (state, action: PayloadAction<number>): AllTipsState => {
      return {
        ...state,
        systemTips: {
          ...state.systemTips,
          currentlySelected: action.payload,
        },
      };
    },
    setUserTipsCurrentlySelected: (state, action: PayloadAction<number>): AllTipsState => {
      return {
        ...state,
        userTips: {
          ...state.userTips,
          currentlySelected: action.payload,
        },
      };
    },
  },
});

enum TipType {
  SYSTEM = 0,
  USER = 1,
}

export const fetchSystemTipsAction = createAsyncThunk(
  'percona/fetchSystemTips',
  (args: { userId: number }, thunkAPI): Promise<void> => {
    return (async () => {
      thunkAPI.dispatch(setSystemTipsLoading());

      let newTips: TipModel[] = [];

      try {
        for (let tip of systemTipsData) {
          const res = await apiOnboarding.get<any, any>(`/tips/${tip.id}/type/${TipType.SYSTEM}/user/${args.userId}`);
          newTips.push({
            ...tip,
            completed: !!res.isCompleted,
          });
        }
      } finally {
        newTips = systemTipsData.map((t) => {
          return { ...t, completed: false };
        });
        thunkAPI.dispatch(setSystemTips(newTips));
      }

      const notCompletedTip = newTips.find((tipData) => !tipData.completed);
      const initial = notCompletedTip !== undefined ? notCompletedTip.id : 0;
      thunkAPI.dispatch(setSystemTipsCurrentlySelected(initial));
    })();
  }
);

export const fetchUserTipsAction = createAsyncThunk(
  'percona/fetchUserTips',
  (args: { userId: number }, thunkAPI): Promise<void> =>
    (async () => {
      thunkAPI.dispatch(setUserTipsLoading());

      const newTips: TipModel[] = [];
      for (let tip of userTipsData) {
        const res = await apiOnboarding.get<any, any>(`/tips/${tip.id}/type/${TipType.USER}/user/${args.userId}`);
        newTips.push({
          ...tip,
          completed: !!res.isCompleted,
        });
      }
      // @ts-ignore
      thunkAPI.dispatch(setUserTips(newTips));
      // @ts-ignore
      const notCompletedTip = newTips.find((tipData) => !tipData.completed);
      // @ts-ignore
      const initial = notCompletedTip !== undefined ? notCompletedTip.id : 0;

      thunkAPI.dispatch(setUserTipsCurrentlySelected(initial));
    })()
);

export const {
  setSystemTips,
  setUserTips,
  setSystemTipsLoading,
  setUserTipsLoading,
  setSystemTipsCurrentlySelected,
  setUserTipsCurrentlySelected,
} = perconaTipsSlice.actions;

export default perconaTipsSlice.reducer;
