import React, { FC } from 'react';
import { TextBlock } from '../TextBlock';
import { HorizontalGroup, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';

declare type Heading = 'h1' | 'h2';
declare type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg';
declare type Justify = 'flex-start' | 'flex-end' | 'space-between' | 'center';
export interface ActionContainerProps {
  headerType: Heading;
  header: string;
  text: string;
  actionsSpacing: Spacing;
  actionsJustify: Justify;
}

export const ActionContainer: FC<ActionContainerProps> = ({
  actionsSpacing,
  headerType,
  header,
  text,
  actionsJustify,
  children,
}) => {
  const styles = useStyles2(getStyles);
  return (
    <div className={styles.welcomePageContent}>
      <TextBlock header={header} text={text} headerType={headerType} />
      <div className={styles.actionsContainer}>
        <HorizontalGroup justify={actionsJustify} spacing={actionsSpacing} wrap>
          {children}
        </HorizontalGroup>
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  welcomePageContent: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    gap: 32px;

    width: 100%;
  `,
  actionsContainer: css`
    background: ${theme.colors.background.canvas};
    width: 100%;
  `,
});
