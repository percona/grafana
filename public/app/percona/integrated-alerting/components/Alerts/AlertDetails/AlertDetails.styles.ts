import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ colors, spacing }: GrafanaTheme) => ({
  wrapper: css`
    display: flex;
    align-items: center;

    & > * {
      flex: 1 0 50;
      display: flex;
      align-items: center;

      &:first-child {
        margin-right: ${spacing.md};
      }

      & > span {
        margin-right: ${spacing.md};
      }
    }

    pre {
      margin-bottom: 0;
    }
  `,
  labelsWrapper: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  `,
  label: css`
    background-color: ${colors.bg3};
    border-radius: 8px;
    padding: 6px;
    line-height: 1;
  `,
});
