import { css } from 'emotion';

export const getStyles = () => ({
  detailsWrapper: css`
    display: flex;

    & > span {
      flex: 0 1 calc(100% / 3);
    }
  `,
});
