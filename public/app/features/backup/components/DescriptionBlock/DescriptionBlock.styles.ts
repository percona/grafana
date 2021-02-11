import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  descriptionWrapper: css`
    display: flex;

    span {
      margin-right: ${spacing.md};
    }

    pre {
      margin-bottom: 0;
      flex-grow: 1;
    }
  `,
});
