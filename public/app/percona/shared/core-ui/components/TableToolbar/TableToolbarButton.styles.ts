import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ v1 }: GrafanaTheme2) => {
  const { colors, typography, spacing } = v1;

  return {
    button: css`
      align-items: center;
      background: none;
      border: none;
      color: ${colors.text};
      cursor: pointer;
      display: flex;
      font-size: ${typography.size.md};
      outline: inherit;

      svg {
        stroke: ${colors.text};
      }

      &:disabled {
        color: ${colors.textWeak};
        cursor: not-allowed;

        svg {
          stroke: ${colors.textWeak};
        }
      }

      span {
        margin-left: ${spacing.xs};
      }
    `,
  };
};
