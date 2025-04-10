import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  newVersionModal: css`
    display: flex;
    flex-direction: column;
    width: 480px;
  `,
  buttons: css`
    margin-top: 35px;
    display: flex;
    justify-content: flex-end;
  `,
  closeButton: css`
    margin-right: 20px;
  `,
  link: css`
    color: ${theme.colors.text.link};
  `,
});
