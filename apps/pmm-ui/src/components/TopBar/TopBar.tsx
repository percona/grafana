import React, { FC, ReactNode, useState } from 'react';
import { Button, Dropdown, Icon, Menu, ToolbarButtonRow, useStyles2, ToolbarButton } from '@grafana/ui';
import { NavBarButton } from './components/NavBarButton';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import perconaIcon from './assets/pmm-percona-icon.svg';
import appIcon from './assets/pmm-app-icon.svg';
import { FeedbackTooltip } from './components/FeedbackTooltip';
export interface TopBarProps {
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

export const TopBar: FC<TopBarProps> = ({
  title,
  userContext,
  showSignIn,
  showFeedbackButton,
  showHelpCenterButton,
  onSignInClick,
  onHelpCenterClick,
  showHelpCenterNotificationMarker,
}) => {
  const [visibleFeedback, setVisibleFeedback] = useState(false);

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
          <div>
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
                setVisibleFeedback(true);
                setVisibleFeedback(false);
              }}
            >
              <ToolbarButton
                icon="message"
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
  `,
  navElement: css`
    display: flex;
    align-items: center;
  `,
  pageIcon: css`
    display: flex;
    padding-right: 15px;
    align-items: center;
  `,
  h1Styles: css`
    margin: 0;
  `,
  titleText: css`
    font-weight: ${theme.typography.fontWeightBold};
    font-size: ${theme.typography.body.fontSize};
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
    z-index: 2;
  `,
  tooltip: css`
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.text.secondary};
    margin-right: 24px;
  `,
});
