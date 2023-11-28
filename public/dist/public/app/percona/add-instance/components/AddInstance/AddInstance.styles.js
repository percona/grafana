import { css } from '@emotion/css';
export const getStyles = (theme) => ({
    Content: css `
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `,
    NavigationPanel: css `
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-width: 825px;
    width: 100%;
    overflow: hidden;
    gap: ${theme.spacing(2)};
    padding: 3px;
    margin: -3px;
  `,
    InstanceCard: css `
    width: 375px;
    margin: 0;
  `,
    Description: css `
    color: ${theme.colors.text.secondary};
  `,
});
//# sourceMappingURL=AddInstance.styles.js.map