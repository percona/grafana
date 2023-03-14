import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing } }: GrafanaTheme2) => ({
  pagination: css`
    display: flex;
    justify-content: space-between;
    padding-top: ${spacing.md};

    & > span:first-child {
      padding-left: ${spacing.md};
    }
  `,
  pageButtonsContainer: css`
    & > span:first-child {
      margin-right: ${spacing.xl};
    }

    & > span:last-child {
      white-space: nowrap;
    }

    button {
      width: 35px;
      justify-content: center;
      &:not(:last-child) {
        margin-right: ${spacing.sm};
      }
    },
  `,
  pageSizeContainer: css`
    & > span:first-child {
      margin-right: ${spacing.md};
    }

    & > span:last-child {
      display: inline-block;
      width: 70px;
    }
  `,
});
