import { css } from '@emotion/css';

import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ breakpoints, spacing }: GrafanaTheme) => {
  const mq = `@media (max-width: ${breakpoints.md})`;

  return {
    instanceForm: css`
      padding: 0px;
      margin-bottom: ${spacing.sm};
      width: 100%;
    `,
    buttonsWrapper: css`
      display: flex;
      width: 100%;
    `,
    fieldsWrapper: css`
      display: flex;
      flex-direction: column;
      width: 100%;
    `,
    credentialsRow: css`
      display: flex;
      width: 100%;
      div {
        width: 100%;
      }
      div:first-child {
        margin-right: ${spacing.md};
      }
      ${mq} {
        flex-direction: column;
        div:first-child {
          margin-right: unset;
        }
      }
    `,
    credentialsField: css`
      width: 48%;
    `,
    roleArnField: css`
      width: 100%;
    `,
    credentialsSubmit: css`
      margin-left: ${spacing.md};
      margin-right: ${spacing.sm};
    `,
  };
};
