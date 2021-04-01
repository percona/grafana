import { stylesFactory } from '@grafana/ui';
import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const getStyles = stylesFactory(
  ({ breakpoints, spacing, typography, border, colors, palette }: GrafanaTheme) => {
    return {
      labelWrapper: css`
        position: absolute;
        top: 24px;
        right: 24px;

        h1 {
          font-size: 14px;
          color: #828282;
          padding: 5px 8px 5px 8px;
          ${border.width.sm} solid ${colors.pageHeaderBorder};
          border-radius: ${border.radius.md};
          user-select: none;
        }
      `,
      link: css`
        color: ${colors.linkExternal};
      `,
    };
  }
);
