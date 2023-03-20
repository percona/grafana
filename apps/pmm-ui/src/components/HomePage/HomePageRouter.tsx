import React, { FC, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../../reducers/store';
import { fetchSystemTipsAction } from '../../reducers/tips/tips';
import { LoadingPlaceholder } from '@grafana/ui';

export interface HomePageRouterProps {
  defaultHomePage: ReactNode;
  overrideHomePage: ReactNode;
  userId: number;
}
export const HomePageRouter: FC<HomePageRouterProps> = (props) => {
  const { loading, tips } = useSelector((state: StoreState) => state.tips.systemTips);
  const allTipsCovered = loading === false && tips.every((t) => t.completed);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSystemTipsAction({ userId: props.userId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return loading ? (
    <LoadingPlaceholder text={'Loading...'} />
  ) : allTipsCovered ? (
    <>{props.defaultHomePage}</>
  ) : (
    <>{props.overrideHomePage}</>
  );
};
