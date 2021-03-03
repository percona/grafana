import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  fieldWrapper: css`
    position: relative;
  `,
  input: css`
    padding: 0;
    border: none;
    margin-right: ${spacing.sm};
    &[readonly] {
      background-color: transparent;
    }
  `,
  lock: css`
    cursor: pointer;
  `,
  fullLock: css`
    position: absolute;
    right: 7px;
    top: 30px;
  `,
});
