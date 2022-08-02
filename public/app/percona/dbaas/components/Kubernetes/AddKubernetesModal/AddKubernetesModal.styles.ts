import { css } from '@emotion/css';
import { GrafanaTheme } from '@grafana/data/src';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  checkbox: css`
    span {
      top: 0;
    }
  `,
});
