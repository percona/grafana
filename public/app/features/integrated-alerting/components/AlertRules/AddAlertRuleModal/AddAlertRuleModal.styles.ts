import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  select: css`
    margin-bottom: 16px;

    & > * {
      height: 37px !important;
    }
  `,
  form: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    /* div {
      display: flex;
      width: 60%;

      label {
        width: 150px;
      }

      & :nth-child(2n) {
        flex: 1;
      }
    } */
  `,
  formFieldsWrapper: css`
    display: flex;
    flex-wrap: wrap;
    width: 60%;
    margin-bottom: 60px;

    dt {
      flex: 0 1 25%;
      max-width: 150px;
    }
    dd {
      margin-left: auto;
      text-align: left;
      flex: 1 1 75%;
    }
  `,
});
