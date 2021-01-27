import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  pagination: css`
    display: flex;
    justify-content: space-between;
    padding-top: ${spacing.md};

    & > span:first-child {
      padding-left: ${spacing.md};
    }
  `,
  pageButtonsContainer: css`
    margin-left: ${spacing.xl};

    & > button {
      width: 35px;
      justify-content: center;
      &:not(:last-child) {
        margin-right: ${spacing.sm};
      }
    },
  `,
  pageSizeContainer: css`
    margin-left: ${spacing.md};
    display: inline-block;
    width: 70px;
  `,
});
