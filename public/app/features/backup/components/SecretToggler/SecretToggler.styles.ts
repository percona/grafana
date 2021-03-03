import { css } from 'emotion';

export const getStyles = () => ({
  input: css`
    padding: 0;
    &[readonly] {
      background-color: transparent;
    }
  `,
  lock: css`
    cursor: pointer;
    margin-left: 5px;
  `,
  wrapper: css`
    white-space: nowrap;
  `,
});
