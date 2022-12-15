import { css } from '@emotion/css';

export const styles = {
  QueryBuilder: css`
    min-width: 500px;

    & > div {
      background-color: transparent;
      padding: 0;
      padding-bottom: 10px;
    }

    & > div:nth-child(1) label {
      display: none;
    }
  `,
};
