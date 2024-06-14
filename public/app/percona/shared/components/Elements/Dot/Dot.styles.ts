import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2, top?: number, bottom?: number, right?: number, left?: number) => ({
  dot: css`
    position: absolute;
    top: ${top ?? 'auto'};
    bottom: ${bottom ?? 'auto'};
    right: ${right ?? 'auto'};
    left: ${left ?? 'auto'};
    width: 6;
    height: 6;
    border-radius: ${theme.shape.radius.circle};
    background-color: ${theme.colors.error.main};
  `,
});
