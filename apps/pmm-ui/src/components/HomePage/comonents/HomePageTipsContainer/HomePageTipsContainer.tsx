import { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { TipsContainer } from '../../../HelpCenter/components/TipsContainer/TipsContainer';
import { useSelector } from 'react-redux';
import { StoreState } from '../../../../reducers/store';
import { setSystemTipsCurrentlySelected } from '../../../../reducers/tips/tips';

interface HomePageTipsContainerProps {
  userId: number;
}

export const HomePageTipsContainer: FC<HomePageTipsContainerProps> = ({ userId }) => {
  const {
    systemTips: { tips, currentlySelected },
  } = useSelector((state: StoreState) => state.tips);

  const styles = useStyles2(getStyles);

  const rocketEmoji = String.fromCodePoint(128640);
  const helpCenterHeading = `${rocketEmoji} Start monitoring databases with PMM`;
  const helpCenterText =
    'Get your PMM running so you can detect what’s going on with your databases in a blink of an eye.';
  return (
    <div className={styles.helpCenterContainer}>
      <div className={styles.helpCenterTextContainer}>
        <h2>{helpCenterHeading}</h2>
        <span>{helpCenterText}</span>
      </div>
      <div className={styles.helpCenterTipsContainer}>
        <TipsContainer
          key="3"
          tips={tips}
          currentlySelectedTipId={currentlySelected}
          userId={userId}
          setTipSelected={setSystemTipsCurrentlySelected}
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
  `,
});
