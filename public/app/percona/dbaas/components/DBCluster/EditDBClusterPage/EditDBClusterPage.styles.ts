import { css } from '@emotion/css';

import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing, typography, colors, palette }: GrafanaTheme) => ({
  optionsWrapper: css`
    margin-top: ${spacing.lg};
    max-width: 650px;
  `,

  basicOptions: css`
    margin-bottom: 64px;
  `,

  collapsableSection: css`
    max-width: 170px;
    margin-bottom: ${spacing.md};
  `,
});
