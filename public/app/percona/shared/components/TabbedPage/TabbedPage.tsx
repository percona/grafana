import { css, cx } from '@emotion/css';
import React, { FC } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Tab, TabsBar, useStyles2 } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import { PageProps } from 'app/core/components/Page/types';

import { useTabs } from './TabbedPage.hooks';
import { TabbedPageSelect } from './TabbedPageSelect';

interface TabbedPageProps extends PageProps {
  vertical?: boolean;
}

export const TabbedPage: FC<TabbedPageProps> = ({ children, vertical, ...props }) => {
  const tabs = useTabs(props.navId, props.navModel);
  const styles = useStyles2(getStyles, vertical);

  return (
    <Page {...props} className={cx(styles.Page, props.className)}>
      <TabsBar className={styles.TabsBar} hideBorder={vertical}>
        {tabs.map((child, index) => (
          <Tab
            label={child.text}
            active={child.active}
            key={`${child.url}-${index}`}
            icon={child.icon}
            href={child.url}
            suffix={child.tabSuffix}
          />
        ))}
      </TabsBar>
      <TabbedPageSelect tabs={tabs} className={styles.TabSelect} />
      <div className={styles.PageBody}>{children}</div>
    </Page>
  );
};

const getStyles = (theme: GrafanaTheme2, verticalTabs?: boolean) => ({
  Page: css`
    [class*='page-inner'] {
      background-color: ${theme.colors.background.canvas};
    }

    [class*='page-content'] {
      display: flex;
      flex-direction: ${verticalTabs ? 'row' : 'column'};

      ${theme.breakpoints.down('lg')} {
        ${verticalTabs ? 'flex-direction: column' : ''};
      }
    }
  `,
  TabsBar: verticalTabs
    ? css`
        width: calc(170px + ${theme.spacing(3)});

        & > div {
          height: auto;
          display: flex;
          align-items: flex-start;
          flex-direction: column;
        }

        [role='tablist'] > div {
          width: 170px;
        }

        ${theme.breakpoints.down('lg')} {
          display: none;
        }
      `
    : '',
  TabSelect: verticalTabs
    ? css`
        width: 200px;
        padding-bottom: ${theme.spacing(1)};

        ${theme.breakpoints.up('lg')} {
          display: none;
        }
      `
    : css`
        display: none;
      `,
  PageBody: css`
    display: flex;
    flex: 1;

    [class*='page-body'] {
      flex: 1;
    }
  `,
});
