import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing }, typography }: GrafanaTheme2) => ({
  nameWrapper: css`
    display: flex;
    align-items: center;
    padding: ${spacing.sm} 0;
  `,
  name: css`
    margin-left: ${spacing.xs};
    margin-right: ${spacing.md};
  `,
  contactTitle: css`
    font-size: ${typography.h5.fontSize};
    font-weight: ${typography.h5.fontWeight};
  `,
});
