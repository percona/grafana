import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { spacing } }: GrafanaTheme2) => ({
  actionsWrapper: css`
    margin-top: 60px;
  `,
  form: css`
    width: 100%;
  `,
  toogleField: css`
    margin-top: ${spacing.formInputMargin};
  `,
  filterWrapper: css`
    display: flex;
    gap: 10px;
  `,
  filterFields: css`
    flex: 1;
  `,
  filterButton: css`
    margin-top: ${spacing.sm};
    margin-bottom: ${spacing.sm};
  `,
});
