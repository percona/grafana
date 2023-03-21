import React, { FC, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../../reducers/store';
import { fetchSystemTipsAction } from '../../reducers/tips/tips';
import { LoadingPlaceholder, useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';

export interface HomePageRouterProps {
  defaultHomePage: ReactNode;
  overrideHomePage: ReactNode;
  userId: number;
}
export const HomePageRouter: FC<HomePageRouterProps> = (props) => {
  const styles = useStyles2(getStyles);
  const { loading, tips } = useSelector((state: StoreState) => state.tips.systemTips);
  const allTipsCovered = loading === false && tips.every((t) => t.completed);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSystemTipsAction({ userId: props.userId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return loading ? (
    <div className={styles.loadingPage}>
      <LoadingPlaceholder text={'Loading...'} />
    </div>
  ) : allTipsCovered ? (
    <>{props.defaultHomePage}</>
  ) : (
    <>{props.overrideHomePage}</>
  );
};

const getStyles = () => ({
  loadingPage: css`
    height: 100%;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
});
