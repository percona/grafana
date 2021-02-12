import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  wrapper: css`
    display: flex;

    & > * {
      flex: 1 1 0;

      &:not(:last-child) {
        padding-right: ${spacing.md};
      }

      &:not(:first-child) {
        padding-left: ${spacing.md};
      }
    }
  `,
});
