import React, { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Button, useStyles2 } from '@grafana/ui';
import tipIcon from '../../assets/pmm-percona-icon-purple.svg'

export const TipNotConnected: FC = () => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.resourceContainer}>
      <div className={styles.header}>
        <div className={styles.title}>Get more PMM by connecting to Platform</div>
      </div>
      <div className={styles.body}>
        <div className={styles.text}>
          <p className={styles.paragraph}>
            Get more <a className={styles.link} href="#">Advisors</a> to automatically check your system status.
          </p>
          <p className={styles.paragraph}>
            Get more <a className={styles.link} href="#">Alerts Templates</a> to notify you when something happens.
          </p>
          <p className={styles.paragraph}>
            Visit our <a className={styles.link} href="#">Premium Plans</a> to discover all benefits and growth potential for your projects.
          </p>
        </div>
        <div>
          <Button className={styles.tipsButton} fullWidth variant="secondary">
            <img
              className={styles.buttonImage}
              alt="pmm-logo"
              src={tipIcon}
            />
            <div className={styles.perconaButtonLabel}>Connect to platform</div>
          </Button>
        </div>
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  link: css`
    color: ${theme.colors.text.link}
  `,
  paragraph: css`
    margin-bottom: ${theme.spacing(1)}
  `,
  tipsButton: css`
    width: 170px;
    align-items: center;
    padding: 0px 0px 0px 0px;
  `,
  buttonImage: css`
    width: 20px;
    height: 18px;
    margin-right: 8px;
  `,
  perconaButtonLabel: css`
    padding: 8px;
    justify-content: center;
    width: 120px;
    font-size: ${theme.typography.body.fontSize};
    display: flex;
    margin-right: 8px;
  `,
  resourceContainer: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;

    width: 384px;
    margin-top: 24px;
    padding-bottom: 16px;

    background: ${theme.colors.background.secondary};
    border-radius: 8px;
  `,
  tipPointer: css`
    cursor: pointer;
  `,
  tipContainerNoPadding: css`
    padding-bottom: 0;
  `,
  header: css`
    padding: 16px 0 8px 16px;
    display: flex;
    gap: 8px;
  `,
  title: css`
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    color: ${theme.colors.text.primary};

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  body: css`
    padding: 16px 16px 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01071em;
    width: 100%;
    max-height: 15em;
  `,
  text: css`
    opacity: 0.65;
    margin-bottom: 16px;
  `,
});
