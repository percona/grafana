import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const getStyles = ({ spacing }: GrafanaTheme) => ({
  select: css`
    margin-bottom: 16px;

    & > {
      height: 37px !important;
    }
  `,
  field: css`
    display: flex;
    width: 60%;

    label {
      width: 150px;
    }

    & :nth-child(2n) {
      flex: 1;
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
    flex-flow: row;
    flex-wrap: wrap;
    width: 60%;
    overflow: visible;
    dt {
      flex-basis: 50%;
      text-overflow: ellipsis;
    }
    dd {
      margin-left: auto;
      text-align: left;
      text-overflow: ellipsis;
      flex-basis: 50%;
    }
  `,
});
