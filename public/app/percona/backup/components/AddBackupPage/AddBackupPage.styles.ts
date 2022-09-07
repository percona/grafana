import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({
  colors,
  shape,
  spacing,
  v1: { colors: colorsV1, typography, spacing: spacingV1, border },
}: GrafanaTheme2) => ({
  pageSwitcherWrapper: css`
    display: flex;
    padding: 20px 0px 20px 0px;
    margin-bottom: 20px;
    & > label {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      width: 200px;
    }
  `,
  formContainer: css`
    display: grid;
    justify-content: center;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 10px;
  `,
  halfPage: css`
    width: 50%;
  `,
  wideField: css`
    grid-column: span 2;
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
  radioButtonField: css`
    & > div > div:nth-of-type(2) * {
      height: 37px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
  backupTypeField: css`
    grid-row-start: 4;
  `,
  textAreaField: css`
    & > textarea {
      height: 50px;
    }
  `,

  contentInner: css`
    flex: 1;
    padding: ${spacing(2)};
  `,
  contentOuter: css`
    background: ${colors.background.primary};
    border: 1px solid ${colors.border.weak};
    border-radius: ${shape.borderRadius()};
    margin: ${spacing(0, 2, 2)};
    flex: 1;
  `,
  headingStyle: css`
    margin-bottom: 20px;
  `,
});
