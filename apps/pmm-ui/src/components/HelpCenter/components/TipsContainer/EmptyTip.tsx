import React, { FC } from 'react';
import headerImg from "../../assets/milestone.svg";
import {GrafanaTheme2} from "@grafana/data";
import {Button, useStyles2} from "@grafana/ui";
import {css} from "@emotion/css";

export const EmptyTip: FC = () => {
  const styles = useStyles2(getStyles);
  return (
    <>
      <div className={styles.imageContainer}>
        <img className={styles.imageContainer} alt="percona-logo" src={headerImg}/>
      </div>
      <div>
        <h3 className={styles.header}>You reached the top!</h3>
        <p className={styles.text}>There are no tips to show at the moment, but you can always get insights on better database performance in Percona resources.</p>
      </div>
      <div className={styles.buttonContainer}>
        <Button fill="text" icon="comments-alt" size="md" variant="secondary" onClick={() => window.open("https://docs.percona.com/percona-monitoring-and-management/index.html", '_blank')}>Community forum</Button>
        <Button fill="text" icon="book-open" size="md" variant="secondary" onClick={() => window.open("https://forums.percona.com/c/percona-monitoring-and-management-pmm/30/none", '_blank')}>Documentation</Button>
      </div>
    </>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    imageContainer: css`
      display: flex;
      justify-content: center;
      padding-top: 10px;
      padding-bottom: 20px;
    `,
    header: css`
      font-weight: 400;
      font-size: 18px;
      line-height: 22px;
      color: ${theme.colors.text.primary};

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `,
    text: css`
      font-weight: 400;
      font-size: 14px;
      line-height: 21px;

      text-align: center;
      color: ${theme.colors.text.primary};
      opacity: 0.65;
    `,
    buttonContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
    `
  }
}
