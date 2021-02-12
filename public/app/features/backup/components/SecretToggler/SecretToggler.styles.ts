import { css } from 'emotion';

export const getStyles = () => ({
  input: css`
    &[disabled] {
      background-color: transparent;
    }
  `,
});
