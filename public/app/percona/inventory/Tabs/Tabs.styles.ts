import { css } from '@emotion/css';

export const getStyles = () => ({
  detailsWrapper: css`
    display: flex;
    flex-direction: column;
  `,
  tagList: css`
    justify-content: flex-start;

    & > li {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `,
  actionPanel: css`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
  `,
  confirmationText: css`
    margin-bottom: 2em;
  `,
  emptyMessage: css`
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  overlay: css`
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
  `,
  deleteItemTxtSpan: css`
    line-height: 15px;
  `,
});
