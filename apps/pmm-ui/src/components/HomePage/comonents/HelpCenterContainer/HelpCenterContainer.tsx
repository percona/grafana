import { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { TipContainer } from '../../../HelpCenter/components/TipsContainer/TipContainer';

export const HelpCenterContainer: FC = () => {
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
      <TipContainer className={styles.helpCenterActionsContainer} />
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
  `,
  helpCenterTextContainer: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    gap: 8px;
    width: 38%;
  `,
  helpCenterActionsContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    width: 62%;
  `,
});
