import React, { FC, useEffect } from 'react';
import { ExploreYourNewPowerUpsTipsContainer } from '../TipsContainer/ExploreYourNewPowerUpsTipsContainer';
import { StartMonitoringTipsContainer } from '../TipsContainer/StartMonitoringTipsContainer';
import { TipNotConnected } from '../TipsContainer/TipNotConnected';
import { FeedbackContainer } from '../FeedbackContainer/FeedbackContainer';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'reducers/store';
import { fetchSystemAndUserTipsAction } from 'reducers/tips/tips';
import { useLocalStorage } from 'hooks/localStorage';
import { EmptyTip } from '../TipsContainer/EmptyTip';
import { getTips } from '../../../../reducers/selectors';

export interface HelpCenterTipsContainerProps {
  userId: number;
  isConnectedUser?: boolean;

  onConnectToPlatformClick: () => void;
}

export const HelpCenterTipsContainer: FC<HelpCenterTipsContainerProps> = (props) => {
  const { isConnectedUser, userId, onConnectToPlatformClick } = props;
  const { systemTips, userTips } = useSelector(getTips);

  const feedbackLocalStorageKey = `grafana.onboarding.feedback.visible.${userId}`;
  const [feedbackVisible, setFeedbackVisible] = useLocalStorage(feedbackLocalStorageKey, true);

  const showEmptyStageTip = !feedbackVisible && systemTips.completed && isConnectedUser && userTips.completed;
  const showTipForNonCompletedTip = !systemTips.completed;

  return (
    <>
      {showEmptyStageTip && <EmptyTip />}

      {!systemTips.completed && (
        <StartMonitoringTipsContainer
          userId={userId}
          tips={systemTips.tips}
          currentlySelectedTipId={systemTips.currentlySelected}
        />
      )}
      {!isConnectedUser && (
        <TipNotConnected showTitle={showTipForNonCompletedTip} onConnectToPlatformClick={onConnectToPlatformClick} />
      )}
      {isConnectedUser && !userTips.completed && (
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
