import { css } from '@emotion/css';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ colors, typography, spacing, border }: GrafanaTheme) => ({
  retryFieldWrapper: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  `,
  retryField: css`
    flex: 1;
  `,
  radioButtonField: css`
    & > div > div:nth-of-type(2) * {
      height: 37px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
  numberInputFieldWrapper: css`
    display: flex;
    gap: 10px;
  `,
});
