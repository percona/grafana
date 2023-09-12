import { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { TipsContainer } from '../../../HelpCenter/components/TipsContainer/TipsContainer';
import { useSelector } from 'react-redux';
import { StoreState } from 'reducers/store';
import { setSystemTipsCurrentlySelected } from 'reducers/tips/tips';
import { Messages } from './HomePageTipsContainer.messages';

interface HomePageTipsContainerProps {
  userId: number;
}

export const HomePageTipsContainer: FC<HomePageTipsContainerProps> = ({ userId }) => {
  const {
    systemTips: { tips, currentlySelected, loading, completed },
  } = useSelector((state: StoreState) => state.tips);

  const styles = useStyles2(getStyles);

  const allTipsCovered = loading === false && completed;
  return allTipsCovered ? (
    <></>
  ) : (
    <div className={styles.helpCenterContainer}>
      <div className={styles.helpCenterTextContainer}>
        <h2>{Messages.helpCenterHeading}</h2>
        <span>{Messages.helpCenterText}</span>
      </div>
      <div className={styles.helpCenterTipsContainer}>
        <TipsContainer
          key="3"
          tips={tips}
          currentlySelectedTipId={currentlySelected}
          userId={userId}
          setTipSelected={setSystemTipsCurrentlySelected}
          utmMedium="welcome_page"
        />
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  helpCenterContainer: css`
    background: #181b1f;

    border: 1px solid rgba(204, 204, 220, 0.07);
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 24px;
    gap: 24px;

    width: 640px;
    border-radius: 4px;
    @media (max-width: 768px) {
      flex-wrap: wrap;
      width: 100%;
      padding: 16px;
    }
  `,
  helpCenterTextContainer: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    gap: 8px;
    width: 42%;
    @media (max-width: 768px) {
      width: 100%;
      flex-direction: row;
      flex-wrap: wrap;
    }
  `,
  helpCenterActionsContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    width: 62%;
    @media (max-width: 768px) {
      width: 100%;
      flex-direction: row;
      flex-wrap: wrap;
    }
  `,
  helpCenterTipsContainer: css`
    width: 58%;
    @media (max-width: 768px) {
      width: 100%;
    }
  `,
});
