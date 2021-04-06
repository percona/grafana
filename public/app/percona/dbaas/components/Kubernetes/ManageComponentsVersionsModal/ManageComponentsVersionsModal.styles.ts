import { css } from 'emotion';

export const getStyles = () => ({
  versionsWrapper: css`
    min-height: 40px;
    max-height: 200px;
  `,
  defaultWrapper: css`
    div[class$='-Menu'] {
      svg {
        display: none;
      }
    }
  `,
});
