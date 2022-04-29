import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing, palette } }: GrafanaTheme2) => ({
  widgetWrapper: css`
    min-height: 200px;
    background-color: ${palette.gray15};
    border-radius: 10px;
    padding: ${spacing.lg};
  `,
});
