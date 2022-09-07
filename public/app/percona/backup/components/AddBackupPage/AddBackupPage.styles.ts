import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = ({
  colors,
  shape,
  spacing,
  v1: { colors: colorsV1, typography, spacing: spacingV1, border },
}: GrafanaTheme2) => ({
  // retryFields: css`
  //   display: flex;
  // `,
  // retrySelect: css`
  //   flex: 1 1 50%;

  //   &:first-child {
  //     padding-right: ${spacingV1.sm};
  //   }

  //   &:last-child {
  //     padding-left: ${spacingV1.sm};
  //   }
  // `,
  pageSwitcherWrapper: css`
    display: flex;
    padding: 20px 0px 20px 0px;
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
  // formHalf: css` //   flex: 0 0 50%; //   &:first-child { //     padding-right: ${spacingV1.md};
  //   }

  //   &:last-child {
  //     padding-left: ${spacingV1.md};
  //   }
  // `,
  // advancedGroup: css`
  //   border: ${border.width.sm} solid ${colorsV1.formInputBorder};
  //   border-radius: ${border.radius.sm};
  //   padding: ${spacingV1.md};
  //   margin-bottom: ${spacingV1.formInputMargin};
  //   position: relative;
  // `,
  // advancedTitle: css`
  //   color: ${colorsV1.formLabel};
  //   font-weight: ${typography.weight.semibold};
  //   position: absolute;
  //   top: -8px;
  //   padding: 0 ${spacingV1.xs};
  //   background-color: ${colorsV1.bodyBg};
  // `,
  // advancedRow: css`
  //   display: flex;
  //   max-width: 400px;
  //   margin: 0 auto;

  //   & > * {
  //     flex: 1 0 50%;

  //     &:first-child {
  //       padding-right: ${spacingV1.sm};
  //     }

  //     &:last-child {
  //       padding-left: ${spacingV1.sm};
  //     }

  //     &:first-child:last-child {
  //       padding-right: 0;
  //       padding-left: 0;
  //     }
  //   }
  // `,
  // checkbox: css`
  //   &:not(:last-child) {
  //     margin-bottom: 0;
  //   }

  //   & > div:last-child {
  //     // we don't need the error line in this case
  //     display: none;
  //   }
  // `,
  // apiErrorSection: css`
  //   margin-bottom: ${spacingV1.md};
  // `,
  // typeSelectionRow: css`
  //   margin-bottom: ${spacingV1.md};

  //   label {
  //     &:first-child {
  //       margin-right: ${spacingV1.md};
  //     }

  //     & > input {
  //       margin-right: ${spacingV1.sm};
  //     }
  //   }
  // `,
  contentInner: css`
    flex: 1;
    padding: ${spacing(2)};
  `,
  contentOuter: css`
    background: ${colors.background.primary};
    border: 1px solid ${colors.border.weak};
    border-radius: ${shape.borderRadius()};
    margin: ${spacing(0, 2, 2)};
    overflow: hidden;
    flex: 1;
  `,
});
