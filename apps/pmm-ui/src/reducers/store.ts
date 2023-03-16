import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import tipsReducer from './tips/tips';
export default configureStore({
  reducer: {
    tips: tipsReducer,
  },
});

export type StoreState = ReturnType<ReturnType<typeof createRootReducer>>;

const createRootReducer = () => {
  const appReducer = combineReducers({
    tips: tipsReducer,
  });

  return (state: any, action: AnyAction) => {
    return appReducer(state, action);
  };
};
