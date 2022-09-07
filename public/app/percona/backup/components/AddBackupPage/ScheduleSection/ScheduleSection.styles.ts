import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({ colors, typography }: GrafanaTheme2) => ({
  scheduleSectionWrapper: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  `,
  SelectFieldWrap: css`
    display: flex;
    flex-direction: column;
    padding-top: 4px;
    margin-bottom: 17px;
  `,
  selectField: css`
    padding-top: 7px;
    padding-bottom: 7px;
  `,
  displayNone: css`
    display: none;
  `,
  multiSelectField: css`
    padding-bottom: 16px;
  `,
  halfPage: css`
    width: 50%;
  `,
  headingStyle: css`
    margin-bottom: 20px;
  `,
});
