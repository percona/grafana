import { css } from '@emotion/css';

import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  optionsWrapper: css`
    margin-top: ${spacing.lg};
    max-width: 720px;
  `,

  collapsableSection: css`
    max-width: 170px;
    margin: 48px 0 24px 0;
  `,
});
