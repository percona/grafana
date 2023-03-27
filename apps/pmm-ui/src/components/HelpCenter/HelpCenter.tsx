import React from 'react';
import React__default, { FC, useState } from 'react';
import { IconButton, Tab, TabsBar, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { ResourcesContainer } from './components/ResourcesContainer';
import { HelpCenterTipsContainer } from "./components/HelpCenterTipsContainer/HelpCenterTipsContainer";

interface HelpCenterProps {
  open: boolean;
  onClose: () => void;

  width: string;
  isConnectedUser?: boolean;
  userId: number;
}

type TabName = 'tips' | 'resources' | 'wnatsnew';

export const HelpCenter: FC<HelpCenterProps> = (props) => {
  const [activeTab, setActiveTab] = useState<TabName>('tips');

  const { open, onClose, width, isConnectedUser, userId } = props;
  const styles = useStyles2(getStyles(open));

  const changeTab = (tab: TabName) => {
    return (e?: React__default.MouseEvent<HTMLAnchorElement>) => {
      e?.preventDefault();
      setActiveTab(tab);
    };
  };

  return (
    <div className={styles.drawer} style={{
      width: width,
      transform: open ? `translateX(0)`: `translateX(${width})`,
      transition: 'transform 225ms',
    }}>
      <div className={styles.indentContainer} />
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h3 className={styles.helpCenterHeader}>Help center</h3>
          <div className="flex-grow-1" />
          <IconButton aria-label="Close 'Add Panel' widget" name="times" size="xl" onClick={onClose} />
        </div>
        <TabsBar hideBorder>
          <TabsBar>
            <Tab label="Tips" active={activeTab === 'tips'} onChangeTab={changeTab('tips')} />
            <Tab label="Resources" active={activeTab === 'resources'} onChangeTab={changeTab('resources')} />
          </TabsBar>
        </TabsBar>
        {activeTab === 'tips' && <HelpCenterTipsContainer
            userId={userId}
            isConnectedUser={isConnectedUser}
        />}

        {activeTab === 'resources' && <ResourcesContainer />}
      </div>
      <div className={styles.indentContainer} />
    </div>
  );
};

const getStyles = (open: boolean) => (theme: GrafanaTheme2) => ({
  drawer: css`
    left: auto;
    right: 0;
    flex: 1 0 auto;
    height: calc(100% - 80px);
    top: 56px;
    position: fixed;
    box-sizing: border-box;
    overflow-y: auto;
    border-left: none;
    background-color: ${theme.colors.background.canvas};
    z-index: 1200;
    visibility: ${open ? 'visible' : 'hidden' };

    @media (max-width: 1279px) {
      height: 100%;
      top: 0;
      visibility: visible;
      box-shadow: 0 8px 24px #010409;
    }
  `,
  container: css`
    padding-left: 16px;
    padding-right: 16px;
    border-left: solid;
    height: 100%;
    border-left-color: ${theme.colors.background.secondary};
    @media (max-width: 1279px) {
      border-left: none;
    }
  `,
  indentContainer: css`
    height: 16px;
  `,
  headerRow: css`
    display: flex;
    align-items: center;
    height: 25px;
    flex-shrink: 0;
    width: 100%;
    font-size: ${theme.typography.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    padding-bottom: ${theme.spacing(1)};
    transition: background-color 0.1s ease-in-out;
  `,
  helpCenterHeader: css`
    margin: 0;
    font-size: 21px;
    line-height: 25px;
    color: ${theme.colors.text.primary};
  `,
});
