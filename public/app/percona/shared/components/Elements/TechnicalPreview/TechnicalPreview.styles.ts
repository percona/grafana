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
          font-size: ${typography.size.lg};
          font-weight: 200;
          color: ${colors.linkExternal};
          padding: 5px 5px 5px;
          border: 2px solid ${colors.linkExternal};
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
