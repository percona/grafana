import React, { FC, useEffect } from 'react';
import { ExploreYourNewPowerUpsTipsContainer } from '../TipsContainer/ExploreYourNewPowerUpsTipsContainer';
import { StartMonitoringTipsContainer } from '../TipsContainer/StartMonitoringTipsContainer';
import { TipNotConnected } from '../TipsContainer/TipNotConnected';
import { FeedbackContainer } from '../FeedbackContainer/FeedbackContainer';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../../../../reducers/store';
import { fetchSystemTipsAction, fetchUserTipsAction } from '../../../../reducers/tips/tips';
import { useLocalStorage } from '../../../../shared/localStorage';

export interface HelpCenterTipsContainerProps {
  userId: number;
  isConnectedUser?: boolean;
}

export const HelpCenterTipsContainer: FC<HelpCenterTipsContainerProps> = (props) => {
  const { isConnectedUser, userId } = props;
  const { systemTips, userTips } = useSelector((state: StoreState) => state.tips);
  const dispatch = useDispatch();

  const feedbackLocalStorageKey = `grafana.onboarding.feedback.visible.${userId}`;
  const [feedbackVisible, setFeedbackVisible] = useLocalStorage(feedbackLocalStorageKey, true);

  let systemsTipsCompleted = true;
  systemTips.tips.forEach((t) => {
    systemsTipsCompleted = systemsTipsCompleted && t.completed;
  });

  let userTipsCompleted = true;
  userTips.tips.forEach((t) => {
    userTipsCompleted = userTipsCompleted && t.completed;
  });

  useEffect(() => {
    dispatch(fetchSystemTipsAction({ userId: userId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(fetchUserTipsAction({ userId: userId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!systemsTipsCompleted && (
        <StartMonitoringTipsContainer
          userId={userId}
          tips={systemTips.tips}
          currentlySelectedTipId={systemTips.currentlySelected}
        />
      )}
      {!isConnectedUser && <TipNotConnected />}
      {!userTipsCompleted && (
        <ExploreYourNewPowerUpsTipsContainer
          userId={userId}
          tips={userTips.tips}
          currentlySelectedTipId={userTips.currentlySelected}
        />
      )}
      <FeedbackContainer
        visible={feedbackVisible}
        onFinish={() => {
          setFeedbackVisible(false);
        }}
      />
    </>
  );
};
