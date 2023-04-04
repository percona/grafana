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

const perconaTipsSlice = createSlice ({
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

export const fetchSystemAndUserTipsAction = createAsyncThunk (
  'percona/fetchSystemAndUserTipsAction',
  (args: {userId: number}, thunkAPI): Promise<void> => {
    return (async () => {
      thunkAPI.dispatch (setSystemTipsLoading());
      thunkAPI.dispatch (setUserTipsLoading());

      let retrievedSystemTips: TipModel[] = [];
      const res = await apiOnboarding.get<any, any> (``);
      for (let tip of res.systemTips) {
        retrievedSystemTips.push ({
          // @ts-ignore
          ...systemTipsData[tip.tipId],
          id: tip.tipId,
          completed: !!tip.isCompleted,
        });
      }

      sortTipsByID(retrievedSystemTips);
      // @ts-ignore
      thunkAPI.dispatch (setSystemTips (retrievedSystemTips));
      // @ts-ignore
      const notCompletedSystemTip = retrievedSystemTips.find((tipData) => !tipData.completed);
      // @ts-ignore
      const notCompletedSystemTipID = notCompletedSystemTip !== undefined ? notCompletedSystemTip.id : 0;
      thunkAPI.dispatch(setSystemTipsCurrentlySelected(notCompletedSystemTipID));

      let retrievedUserTips: TipModel[] = [];
      for (let tip of res.userTips) {
        retrievedUserTips.push({
          // @ts-ignore
          ...userTipsData[tip.tipId],
          id: tip.tipId,
          completed: !!tip.isCompleted,
        });
      }

      sortTipsByID(retrievedUserTips);

      // @ts-ignore
      thunkAPI.dispatch(setUserTips(retrievedUserTips));
      // @ts-ignore
      const notCompletedUserTip = retrievedUserTips.find((tipData) => !tipData.completed);
      // @ts-ignore
      const notCompletedUserTipID = notCompletedUserTip !== undefined ? notCompletedUserTip.id : 0;
      thunkAPI.dispatch(setUserTipsCurrentlySelected(notCompletedUserTipID));

      let systemsTipsCompleted = true;
      retrievedSystemTips.forEach((t) => {
        systemsTipsCompleted = systemsTipsCompleted && t.completed;
      });
      thunkAPI.dispatch(setSystemTipsCompleted(systemsTipsCompleted));

      let userTipsCompleted = true;
      retrievedUserTips.forEach((t) => {
        userTipsCompleted = userTipsCompleted && t.completed;
      });
      thunkAPI.dispatch(setUserTipsCompleted(userTipsCompleted));
    }) ();
  }
);


export const completeUserTip = createAsyncThunk (
  'percona/completeUserTips',
  (args: {tipId: number}, thunkAPI): Promise<void> =>
    (async () => {
      const res = await apiOnboarding.post<any, any>("/tips/complete", {
        tipId: args.tipId,
      });

      if (res.errorCode) {
        console.error(res.errorCode);
        console.error(res.errorMessage);
        throw Error(res.errorMessage)
      } else {
        let retrievedUserTips: TipModel[] = [];

        const res = await apiOnboarding.get<any, any>(``);
        for (let tip of res.userTips) {
          retrievedUserTips.push({
            // @ts-ignore
            ...userTipsData[tip.tipId],
            id: tip.tipId,
            completed: !!tip.isCompleted,
          });
        }

        sortTipsByID(retrievedUserTips);

        // @ts-ignore
        thunkAPI.dispatch(setUserTips(retrievedUserTips));
        // @ts-ignore
        const notCompletedUserTip = retrievedUserTips.find((tipData) => !tipData.completed);
        // @ts-ignore
        const notCompletedUserTipID = notCompletedUserTip !== undefined ? notCompletedUserTip.id : 0;
        thunkAPI.dispatch (setUserTipsCurrentlySelected(notCompletedUserTipID));
      }
    }) ()
);

const sortTipsByID = (tips: TipModel[]) => {
  tips.sort((a: TipModel, b: TipModel) => {
    if (a.id > b.id) {
      return 1;
    } else if (a.id === b.id) {
      return 0
    }
    return -1;
  });
}

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
