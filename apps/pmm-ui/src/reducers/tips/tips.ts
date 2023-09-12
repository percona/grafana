import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import systemTipsData from '../../components/HelpCenter/components/TipsContainer/data/systemTips.json';
import userTipsData from '../../components/HelpCenter/components/TipsContainer/data/userTips.json';
import { ApiTipModel, OnboardingAPI } from 'api';

export interface AllTipsState {
  systemTips: TipsState;
  userTips: TipsState;
}

export interface TipsState {
  loading: boolean;
  tips: TipModel[];
  currentlySelected: number;
  completed: boolean;
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
  canUserComplete?: boolean;
}

const initialTipsState: AllTipsState = {
  userTips: {
    // @ts-ignore
    tips: [],
    currentlySelected: 0,
    loading: false,
    completed: false,
  },
  systemTips: {
    // @ts-ignore
    tips: [],
    currentlySelected: 0,
    loading: true,
    completed: false,
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
    setSystemTipsCompleted: (state, action: PayloadAction<boolean>): AllTipsState => {
      return {
        ...state,
        systemTips: {
          ...state.systemTips,
          completed: action.payload,
        },
      };
    },
    setUserTipsCompleted: (state, action: PayloadAction<boolean>): AllTipsState => {
      return {
        ...state,
        userTips: {
          ...state.userTips,
          completed: action.payload,
        },
      };
    },
  },
});

export const fetchSystemAndUserTipsAction = createAsyncThunk(
  'percona/fetchSystemAndUserTipsAction',
  (args: { userId: number }, thunkAPI): Promise<void> => {
    return (async () => {
      thunkAPI.dispatch(setSystemTipsLoading());
      thunkAPI.dispatch(setUserTipsLoading());

      let systemTips: ApiTipModel[] = [];
      let userTips: ApiTipModel[] = [];
      try {
        const res = await OnboardingAPI.getOnboardingState();
        systemTips = res.systemTips;
        userTips = res.userTips;
      } catch (e) {
        systemTips = Array.from(new Map(Object.entries(systemTipsData)).values())
          .map((t) => t as TipModel)
          .map((t) => {
            return { tipId: t.id, isCompleted: false } as ApiTipModel;
          });
        userTips = Array.from(new Map(Object.entries(userTipsData)).values())
          .map((t) => t as TipModel)
          .map((t) => {
            return { tipId: t.id, isCompleted: false } as ApiTipModel;
          });
        throw e;
      } finally {
        processFetchedTips(
          systemTips,
          systemTipsData as unknown as Map<number, TipModel>,
          (t) => thunkAPI.dispatch(setSystemTips(t)),
          (id) => thunkAPI.dispatch(setSystemTipsCurrentlySelected(id)),
          (allCompleted) => thunkAPI.dispatch(setSystemTipsCompleted(allCompleted))
        );

        processFetchedTips(
          userTips,
          userTipsData as unknown as Map<number, TipModel>,
          (t) => thunkAPI.dispatch(setUserTips(t)),
          (id) => thunkAPI.dispatch(setUserTipsCurrentlySelected(id)),
          (allCompleted) => thunkAPI.dispatch(setUserTipsCompleted(allCompleted))
        );
      }
    })();
  }
);

export const completeUserTip = createAsyncThunk(
  'percona/completeUserTips',
  (args: { tipId: number }, thunkAPI): Promise<void> =>
    (async () => {
      const res = await OnboardingAPI.completeTip(args.tipId);

      if (res.errorCode) {
        console.error(res.errorCode);
        console.error(res.errorMessage);
        throw Error(res.errorMessage);
      } else {
        let userTips: ApiTipModel[] = [];
        try {
          const res = await OnboardingAPI.getOnboardingState();
          userTips = res.userTips;
        } catch (e) {
          userTips = Array.from(new Map(Object.entries(userTipsData)).values())
            .map((t) => t as TipModel)
            .map((t) => {
              return { tipId: t.id, isCompleted: false } as ApiTipModel;
            });
          throw e;
        } finally {
          processFetchedTips(
            userTips,
            userTipsData as unknown as Map<number, TipModel>,
            (t) => thunkAPI.dispatch(setUserTips(t)),
            (id) => thunkAPI.dispatch(setUserTipsCurrentlySelected(id)),
            (allCompleted) => thunkAPI.dispatch(setUserTipsCompleted(allCompleted))
          );
        }
      }
    })()
);

const sortTipsByID = (tips: TipModel[]) => {
  tips.sort((a: TipModel, b: TipModel) => {
    if (a.id > b.id) {
      return 1;
    } else if (a.id === b.id) {
      return 0;
    }
    return -1;
  });
};

const findUncompletedTipId = (tips: TipModel[]): number => {
  const notCompletedTip = tips.find((tipData) => !tipData.completed);
  // @ts-ignore
  return notCompletedTip !== undefined ? notCompletedTip.id : 0;
};

const processFetchedTips = (
  fetchedTips: ApiTipModel[],
  constantTips: Map<number, TipModel>,
  setTipsStateDispatcher: (tips: TipModel[]) => void,
  setSelectedTipDispatcher: (tipId: number) => void,
  setAllTipsCompletedDispatcher: (areAllTipsCompleted: boolean) => void
) => {
  let processedTips: TipModel[] = [];
  for (let tip of fetchedTips) {
    processedTips.push({
      // @ts-ignore
      ...constantTips[tip.tipId],
      id: tip.tipId,
      completed: tip.isCompleted,
    });
  }

  sortTipsByID(processedTips);
  setTipsStateDispatcher(processedTips);
  setSelectedTipDispatcher(findUncompletedTipId(processedTips));
  setAllTipsCompletedDispatcher(processedTips.every((t) => t.completed));
};

export const {
  setSystemTips,
  setUserTips,
  setSystemTipsLoading,
  setUserTipsLoading,
  setSystemTipsCurrentlySelected,
  setUserTipsCurrentlySelected,
  setSystemTipsCompleted,
  setUserTipsCompleted,
} = perconaTipsSlice.actions;

export default perconaTipsSlice.reducer;
