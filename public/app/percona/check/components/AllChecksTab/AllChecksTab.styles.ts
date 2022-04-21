import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing } }: GrafanaTheme2) => ({
  descriptionFilter: css`
    flex: 1 0 calc(100% - 2 * ${spacing.md});
  `,
});
