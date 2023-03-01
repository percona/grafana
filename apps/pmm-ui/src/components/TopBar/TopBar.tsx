import React, { FC, ReactNode, useState } from 'react';
import { Button, Dropdown, Icon, Menu, ToolbarButtonRow, useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import perconaIcon from './assets/pmm-percona-icon.svg';
import appIcon from './assets/pmm-app-icon.svg';
import platformIcon from './assets/pmm-platform-purple.svg';
import { FeedbackTooltip } from './components/FeedbackTooltip';
export interface TopBarProps {
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
  userContext,
  showSignIn,
  showFeedbackButton,
  showHelpCenterButton,
  onSignInClick,
  onHelpCenterClick,
  showHelpCenterNotificationMarker,
}) => {
  const [visibleFeedback, setVisibleFeedback] = useState(false);

  // TODO: consider passing proper appSubUrl
  const appSubUrl = '/graph';

  const styles = useStyles2(getStyles);
  const userMenu = (
    <Menu>
      <Menu.Item label="Open Percona Platform" className={styles.miOpenPerconaPlatform} icon="info" />
      <Menu.Item label="Percona Account profile" />
      <Menu.Item label="Platform connection settings" />
      <Menu.Divider />
      <Menu.Item url={appSubUrl + '/profile'} label="Preferences" />
      <Menu.Item url={appSubUrl + '/profile/notifications'} label="Notification history" />
      <Menu.Item url={appSubUrl + '/profile/password'} label="Change password" />
      <Menu.Divider />
      <Menu.Item url={appSubUrl + '/logout'} label="Sign out" icon="signout" />
    </Menu>
  );

  const connectedToPortal = userContext;

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
              <div className={styles.titleText}>
                {connectedToPortal ? 'PMM' : 'Percona monitoring and management'}
              </div>
            </h1>
          </div>
        </nav>
      </div>
      <ToolbarButtonRow alignment="right">
        {showHelpCenterNotificationMarker && <div className={styles.notificationMarker} />}
        {showSignIn &&
          (connectedToPortal ? (
            <>
              <Dropdown overlay={userMenu} placement="bottom">
                <Button variant="secondary">John Doe</Button>
              </Dropdown>
            </>
          ) : (
            <>
              <div className={styles.notificationMarker} />
              <div className={styles.tooltip}>
                Get more out of PMM
                <Icon name="arrow-right" />
              </div>
              <Button
                className={styles.connectButton}
                icon="info"
                variant="secondary"
                onClick={onSignInClick}
              >
                Connect to platform
              </Button>
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
              <Button
                variant="secondary"
                icon="message"
                onClick={() => {
                  setVisibleFeedback(true);
                }}
              />
            </FeedbackTooltip>
          </>
        )}
        {showHelpCenterButton && <Button variant="secondary" icon="question-circle" onClick={onHelpCenterClick} />}
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
  connectButton: css`
    & > div > svg {
      height: 18px;
      width: 20px;

      background-color: currentColor;
      -webkit-mask-image: url(${perconaIcon});
    }

    & > div > svg > path {
      display: none;
    }
  `,
  miOpenPerconaPlatform: css`
    background: none;
    & > div > svg {
      height: 32px;
      width: 32px;
      background: url(${platformIcon});
    }

    & > div > svg > path {
      display: none;
    }

    &:hover, &:focus {
      background: rgba(71, 47, 100, 0.67);
      color: ${theme.colors.error.contrastText};
    }

  `,
});
