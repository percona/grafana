import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing, typography, colors, palette }: GrafanaTheme) => ({
  modalWrapper: css`
    div[data-qa='modal-body'] {
      left: 21%;
      top: 4%;
      width: 60%;
      max-width: none;
    }
  `,
  stepProgressWrapper: css`
    overflow: hidden;

    div[class$='-current'] {
      overflow: auto;
    }
  `,
  warningIcon: css`
    fill: ${palette.brandDanger};
    height: 30px;
    width: 30px;
    margin-right: ${spacing.sm};
  `,
  settingsLink: css`
    color: ${colors.linkExternal};
    &:hover {
      color: ${colors.linkExternal};
    }
  `,
  warningWrapper: css`
    align-items: center;
    display: flex;
  `,
  warningMessage: css`
    font-size: ${typography.size.md};
    margin-left: ${spacing.xs};
  `,
});
