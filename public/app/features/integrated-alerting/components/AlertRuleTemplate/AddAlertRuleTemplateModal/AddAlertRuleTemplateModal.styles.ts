import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  formWrapper: css`
    #input-yaml-id {
      min-height: 250px;
    }
  `,
  uploadAction: css`
    margin-bottom: ${spacing.xl};
    svg {
      margin-right: ${spacing.sm};
    }
  `,
});
