import { css } from 'emotion';

export const getStyles = () => ({
  button: css`
    min-width: 80px;
    justify-content: center;
  `,
  testButton: css`
    background: linear-gradient(180deg, #04be5b 0%, #04b155 100%);
    border: 1px solid #058943;

    &:hover {
      background: #04be5b;
    }
  `,
});
