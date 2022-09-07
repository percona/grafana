import { css } from '@emotion/css';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ colors, typography, spacing, border }: GrafanaTheme) => ({
  retryFieldWrapper: css`
    display: flex;
    gap: 10px;
  `,
  radioButtonField: css`
    & > div > div:nth-of-type(2) * {
      height: 37px;
      width: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
});
