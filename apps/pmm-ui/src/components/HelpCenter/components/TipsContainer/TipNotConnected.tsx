import React, { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Button, useStyles2 } from '@grafana/ui';
import { Messages } from './TipNotConnected.messages';
import tipIcon from '../../assets/pmm-percona-icon-purple.svg';

interface TipNotConnectedProps {
  showTitle?: boolean;

  onConnectToPlatformClick: () => void;
}

export const TipNotConnected: FC<TipNotConnectedProps> = ({ showTitle, onConnectToPlatformClick }) => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.tipContainer}>
      {showTitle && (
        <div className={styles.headerContainer}>
          <h3 className={styles.tipsLabel}>{Messages.title}</h3>
        </div>
      )}
      <div className={styles.resourceContainer}>
        <div className={styles.body}>
          {Messages.connectingInfo}
          <ul className={styles.unorderedList}>
            <li>{Messages.li1}</li>
            <li>{Messages.li2}</li>
            <li>{Messages.li3}</li>
            <li>{Messages.li4}</li>
          </ul>

          <div>
            <Button className={styles.tipsButton} fullWidth variant="secondary" onClick={onConnectToPlatformClick}>
              <img className={styles.buttonImage} alt="pmm-logo" src={tipIcon} />
              <div className={styles.perconaButtonLabel}>{Messages.button.connectToPlatform}</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  tipsLabel: css`
    font-size: ${theme.typography.h4.fontSize};
    color: ${theme.colors.text.primary};
  `,
  headerContainer: css`
    display: flex;
    justify-content: flex-start;
    padding-bottom: ${theme.spacing(1)};
  `,
  tipsButton: css`
    width: 230px;
    padding: 0;
  `,
  buttonImage: css`
    width: 20px;
    height: 18px;
    margin-right: 8px;
  `,
  perconaButtonLabel: css`
    padding: 8px;
    justify-content: center;
    width: 180px;
    font-size: ${theme.typography.body.fontSize};
    display: flex;
    margin-right: 8px;
  `,
  resourceContainer: css`
    flex-direction: column;
    padding-bottom: ${theme.spacing(3)};
    background: ${theme.colors.background.secondary};
    border-radius: 8px;
  `,
  body: css`
    padding: 16px 16px 0;
    font-size: ${theme.typography.body.fontSize};
  `,
  unorderedList: css`
    padding: ${theme.spacing(2, 3, 2)};
  `,
  tipContainer: css`
    margin-bottom: ${theme.spacing(4)};
    margin-top: ${theme.spacing(3)};
  `,
});
