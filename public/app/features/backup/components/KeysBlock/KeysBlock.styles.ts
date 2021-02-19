import { css } from 'emotion';

export const getStyles = () => ({
  keysWrapper: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  keyLabel: css`
    display: inline-block;
    width: 100px;
  `,
  secretTogglerWrapper: css`
    display: inline-block;
  `,
});
