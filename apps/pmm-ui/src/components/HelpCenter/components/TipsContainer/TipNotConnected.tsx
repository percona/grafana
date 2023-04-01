import React, { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Button, useStyles2 } from '@grafana/ui';
import { Messages } from './TipNotConnected.messages';
import tipIcon from '../../assets/pmm-percona-icon-purple.svg';

export const TipNotConnected: FC = () => {
  const styles = useStyles2 (getStyles);

  return (
    <div className={styles.tipContainer}>
      <div className={styles.headerContainer}>
        <h3 className={styles.tipsLabel}>{Messages.title}</h3>
      </div>
      <div className={styles.resourceContainer}>
        <div className={styles.body}>
          {Messages.connectingInfo}
          <ul className={styles.unorderedList}>
            <li>
              {Messages.getMore}
              <a className={styles.link} href={Messages.link.advisors} target="_blank" rel="noreferrer">
                {Messages.advisors}
              </a>
              {Messages.advisorsDescription}
            </li>
            <li>
              {Messages.getMore}
              <a className={styles.link} href={Messages.link.alertsTemplate} target="_blank" rel="noreferrer">
                {Messages.alertsTemplate}
              </a>
              {Messages.alertsTemplateDescription}
            </li>
          </ul>
          <p>
            {Messages.visitOur}
            <a className={styles.link} href={Messages.link.premiumPlans} target="_blank" rel="noreferrer">
              {Messages.premiumPlans}
            </a>
            {Messages.premiumPlansDescription}
          </p>

          <div>
            <Button className={styles.tipsButton} fullWidth variant="secondary">
              <img className={styles.buttonImage} alt="pmm-logo" src={tipIcon}/>
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
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    color: ${theme.colors.text.primary};
  `,
  headerContainer: css`
    display: flex;
    justify-content: flex-start;
  `,
  link: css`
    color: ${theme.colors.text.link};
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

    margin-bottom: ${theme.spacing (2)};

    padding-bottom: ${theme.spacing (2)};

    background: ${theme.colors.background.secondary};
    border-radius: 8px;
  `,
  header: css`
    padding: ${theme.spacing (2, 2)};
  `,
  title: css`
    font-weight: 400;
    font-size: ${theme.typography.h4.fontSize};
    line-height: 22px;
    color: ${theme.colors.text.primary};
  `,
  body: css`
    padding: 6px 16px 0;
    font-size: ${theme.typography.body.fontSize};
  `,

  unorderedList: css`
    padding: ${theme.spacing(2, 3)};
  `,
  tipContainer: css`
    margin-bottom: ${theme.spacing(4)};
    margin-top: ${theme.spacing(3)};
  `,
});
