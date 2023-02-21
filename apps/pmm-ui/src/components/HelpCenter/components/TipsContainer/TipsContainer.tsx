import React, { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Button, useStyles2 } from '@grafana/ui';
import { Resource } from '../Resource/Resource';
import tipIcon from '../../assets/pmm-percona-icon-purple.svg'

export const TipsContainer: FC = () => {
  const styles = useStyles2(getStyles);

  const resourceText = (
    <>
      <p className={styles.paragraph}>
        Get more <a className={styles.link} href="#">Advisors</a> to automatically check your system status.
      </p>
      <p className={styles.paragraph}>
        Get more <a className={styles.link} href="#">Alerts Templates</a> to notify you when something happens.
      </p>
      <p className={styles.paragraph}>
        Visit our <a className={styles.link} href="#">Premium Plans</a> to discover all benefits and growth potential for your projects.
      </p>
    </>
  );

  const button = (
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
  )

  return (
    <>
      <Resource
        title="Get more PMM by connecting to Platform"
        text={resourceText}
        button={button}
        url="#"
      />
    </>
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
});
