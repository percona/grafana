import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing } }: GrafanaTheme2) => ({
  labelWrapper: css`
    display: flex;
    flex-wrap: wrap;
    svg {
      margin-left: ${spacing.xs};
    }
  `,
  advancedRow: css`
    display: flex;
    align-items: baseline;
    padding-bottom: ${spacing.md};
    flex-wrap: wrap;
  `,
  advancedCol: css`
    align-items: center;
    display: flex;
    width: 230px;
  `,
});
