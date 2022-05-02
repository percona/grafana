import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing, palette }, typography }: GrafanaTheme2) => ({
  widgetWrapper: css`
    min-height: 200px;
    background-color: ${palette.gray15};
    border-radius: 10px;
    padding: ${spacing.lg};
    display: flex;
    flex-direction: column;
  `,
  childrenWrapper: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  widgetTitle: css`
    font-size: ${typography.h4.fontSize};
    font-weight: ${typography.h4.fontWeight};
  `,
});
