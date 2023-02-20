import React, { FC, ReactNode, useState } from 'react';
import { Button, Dropdown, Icon, Menu, ToolbarButtonRow, useStyles2, ToolbarButton } from '@grafana/ui';
import { NavBarButton } from './components/NavBarButton';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import perconaIcon from './assets/pmm-percona-icon.svg';
import appIcon from './assets/pmm-app-icon.svg';
import { FeedbackTooltip } from './components/FeedbackTooltip';
export interface NavBarProps {
  title: string;
  showSignIn?: boolean;
  showFeedbackButton?: boolean;
  showHelpCenterButton?: boolean;
  userContext?: any;

  onSignInClick: () => void;
  onFeedbackClick: () => void;
  onNotificationClick: () => void;
  onHelpCenterClick: () => void;
  showHelpCenterNotificationMarker?: boolean;
  children?: ReactNode;
}

export const NavBar: FC<NavBarProps> = ({
  title,
  userContext,
  showSignIn,
  showFeedbackButton,
  showHelpCenterButton,
  onSignInClick,
  onHelpCenterClick,
  showHelpCenterNotificationMarker,
}) => {
  const [visibleFeedback, setVisibleFeedback] = useState(true);

  const styles = useStyles2(getStyles);
  const userMenu = (
    <Menu>
      <Menu.Item label="Preferences" />
      <Menu.Item label="Notification history" />
      <Menu.Item label="Change password" />
      <Menu.Divider />
      <Menu.Item label="Open Percona Platform" />
      <Menu.Item label="Edit my Percona profile" />
      <Menu.Divider />
      <Menu.Item label="Sign out" icon="signout" />
    </Menu>
  );

  return (
    <nav className={styles.toolbar}>
      <div className={styles.leftWrapper}>
        <div className={styles.pageIcon}>
          <div className={styles.pmmIconHolder}>
            <img alt="percona-logo" className={styles.pmmIcon} src={appIcon} />
          </div>
        </div>
        <nav className={styles.navElement}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.h1Styles}>
              <div className={styles.titleText}>{title}</div>
            </h1>
          </div>
        </nav>
      </div>
      <ToolbarButtonRow alignment="right">
        {showHelpCenterNotificationMarker && <div className={styles.notificationMarker} />}
        {showSignIn &&
          (userContext ? (
            <>
              <Dropdown overlay={userMenu} placement="bottom">
                <Button variant="secondary">John Doe</Button>
              </Dropdown>
            </>
          ) : (
            <>
              <div className={styles.notificationMarker} />
              <div className={styles.tooltip}>
                Get free features with a quick sign in
                <Icon name="arrow-right" />
              </div>
              <NavBarButton title="Percona sign in" imgSrc={perconaIcon} imgAlt="PMM" onClick={onSignInClick} />
            </>
          ))}
        {showFeedbackButton && (
          <>
            <FeedbackTooltip
              visible={visibleFeedback}
              onClose={() => {
                console.log('da');
                setVisibleFeedback(true);
                setVisibleFeedback(false);
              }}
            >
              <ToolbarButton
                icon="bell"
                onClick={() => {
                  setVisibleFeedback(true);
                }}
              />
            </FeedbackTooltip>
          </>
        )}
        {showHelpCenterButton && <NavBarButton icon="question-circle" onClick={onHelpCenterClick} />}
      </ToolbarButtonRow>
    </nav>
  );
};

export const getStyles = (theme: GrafanaTheme2) => ({
  componentStyle: css`
    width: 100%;
  `,
  toolbar: css`
    align-items: center;
    height: 64px;
    background: ${theme.colors.background.canvas};
    display: flex;
    gap: ${theme.spacing(2)};
    justify-content: space-between;
    padding: ${theme.spacing(1.5, 2)};
  `,
  pmmIconHolder: css`
    display: inline-block;
    line-height: 0;
  `,
  pmmIcon: css`
    height: 32px;
    width: 32px;
  `,
  leftWrapper: css`
    display: flex;
    flex-wrap: nowrap;
    max-width: 70%;
  `,
  navElement: css`
    display: flex;
    align-items: center;
    min-width: 0;
  `,
  titleWrapper: css`
    display: flex;
    margin: 0;
    min-width: 0;
  `,
  pageIcon: css`
    display: flex;
    padding-right: 15px;
    align-items: center;
  `,
  h1Styles: css`
    margin: 0;
    line-height: inherit;
    flex-grow: 1;
    min-width: 0;
  `,
  titleText: css`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    font-size: ${theme.typography.body.fontSize};
    line-height: 100%;
    flex: none;
    order: 0;
    flex-grow: 1;
    color: ${theme.colors.text.primary};
  `,
  notificationMarker: css`
    position: absolute;
    width: 10px;
    height: 10px;
    right: -3px;
    top: -3px;
    background: #ff5286;
    border: 2px solid ${theme.colors.background.canvas};
    border-radius: 16px;
    flex: none;
    order: 6;
    flex-grow: 0;
    z-index: 6;
  `,
  tooltip: css`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: ${theme.typography.bodySmall.fontSize};
    line-height: 15px;
    color: ${theme.colors.text.secondary};
    flex: none;
    order: 0;
    flex-grow: 0;
    margin-right: 24px;
  `,
});
