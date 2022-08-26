import { css } from '@emotion/css';

import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ colors, spacing }: GrafanaTheme) => ({
  disabledButton: css`
    color: ${colors.formInputDisabledText};
    background-color: ${colors.dropdownBg};
    pointer-events: none;

    :hover {
      background-color: ${colors.dropdownBg} !important;
    }
  `,
  iconWrapper: css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: ${spacing.xs};
  `,
});
