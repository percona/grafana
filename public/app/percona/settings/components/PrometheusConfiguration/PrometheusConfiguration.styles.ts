import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  link: css`
    color: ${theme.colors.text.link};
  `,
  configuration: css`
    margin: ${theme.spacing(1)} 0;
    min-height: 150px;
  `,
});
