import { css } from '@emotion/css';

import { GrafanaTheme } from '@grafana/data/src';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  buttonsWrapper: css`
    display: flex;
    gap: ${spacing.md};
  `,
});
