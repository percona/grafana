import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1: { colors, spacing } }: GrafanaTheme2) => {
  return {
    link: css`
      color: ${colors.linkExternal};
      &:hover {
        color: ${colors.textBlue};
      }
    `,
    chips: css`
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: -${spacing.sm};

      & > * {
        margin-right: ${spacing.sm};
        margin-bottom: ${spacing.sm};
      }
    `,
    actions: css`
      display: flex;
      align-items: center;
      justify-content: center;
    `,
  };
};
