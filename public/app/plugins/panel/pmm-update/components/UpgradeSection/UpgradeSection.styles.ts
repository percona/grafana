import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  notAvailable: css`
    margin-top: ${theme.spacing(1)};
    color: ${theme.colors.text.secondary};
  `,
  link: css`
    color: ${theme.colors.text.link};
  `,
});
