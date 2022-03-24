import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';

export const getSettingsStyles = ({ v1: { breakpoints, spacing } }: GrafanaTheme2) => {
  const mq = `@media (max-width: ${breakpoints.md})`;

  return {
    wrapper: css`
      ${mq} {
        width: 100%;
      }
    `,
    labelWrapper: css`
      display: flex;
      flex-wrap: wrap;
      svg {
        margin-left: ${spacing.xs};
      }
    `,
    actionButton: css`
      margin-top: ${spacing.sm};
      width: fit-content;
      i {
        margin-right: ${spacing.sm};
      }
      span {
        display: flex;
      }
    `,
    tabs: css`
      background: transparent;
    `,
  };
};
