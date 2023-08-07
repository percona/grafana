import { css } from '@emotion/css';

export const styles = {
  QueryBuilder: css`
    min-width: 500px;

    & > div {
      background-color: transparent;
      padding: 0;
      padding-bottom: 10px;
    }

    & > div:first-child label {
      display: none;
    }

    div[data-testid='prometheus-dimensions-filter-item'] > div > div:nth-child(2) {
      background-color: transparent;
      pointer-events: none;
      border: none;
      cursor: initial;
      padding: 0 10px;

      * {
        margin: 0;
        padding: 0;
      }

      /* caret */
      & > div > div:nth-child(2) {
        display: none;
      }
    }
  `,
};
