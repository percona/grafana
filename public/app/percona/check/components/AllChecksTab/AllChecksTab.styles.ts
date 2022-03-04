import { css } from '@emotion/css';

export const getStyles = () => ({
  wrapper: css`
    background-color: transparent;
    display: flex;
    flex-direction: row;
    justify-content: center;
    overflow-y: scroll;
    height: 100%;
  `,
  nameColumn: css`
    width: 250px;
  `,
  statusColumn: css`
    width: 100px;
  `,
  actionsColumn: css`
    width: 150px;
  `,
  intervalColumn: css`
    width: 150px;
  `,
  spinner: css`
    display: flex;
    height: 10em;
    align-items: center;
    justify-content: center;
  `,
});
