import { css } from '@emotion/css';
import React, { Suspense, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
// @ts-ignore
import Drop from 'tether-drop';

import { locationSearchToObject, navigationLogger, reportPageview } from '@grafana/runtime';
import { ErrorBoundary } from '@grafana/ui';
import appEvents from 'app/core/app_events';
import { HelpModal } from 'app/core/components/help/HelpModal';
import { contextSrv } from 'app/core/core';
import { setHelpCenterOpened } from 'app/percona/shared/core/reducers/helpCenter/helpCenter';
import { getHelpCenterState, getPerconaServer, getPerconaSettings } from 'app/percona/shared/core/selectors';
import { useSelector } from 'app/types';
import { ShowModalReactEvent } from 'app/types/events';

import { PmmUi } from '../../percona/federation';
import { useAppDispatch } from '../../store/store';
import { useGrafana } from '../context/GrafanaContext';

import { GrafanaRouteError } from './GrafanaRouteError';
import { GrafanaRouteLoading } from './GrafanaRouteLoading';
import { GrafanaRouteComponentProps, RouteDescriptor } from './types';

export interface Props extends Omit<GrafanaRouteComponentProps, 'queryParams'> {}

export function GrafanaRoute(props: Props) {
  const { chrome, keybindings } = useGrafana();

  chrome.setMatchedRoute(props.route);

  useEffect(() => {
    keybindings.clearAndInitGlobalBindings();

    updateBodyClassNames(props.route);
    cleanupDOM();
    navigationLogger('GrafanaRoute', false, 'Mounted', props.match);

    return () => {
      navigationLogger('GrafanaRoute', false, 'Unmounted', props.route);
      updateBodyClassNames(props.route, true);
    };
    // props.match instance change even though only query params changed so to make this effect only trigger on route mount we have to disable exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    cleanupDOM();
    reportPageview();
    navigationLogger('GrafanaRoute', false, 'Updated', props);
  });

  navigationLogger('GrafanaRoute', false, 'Rendered', props.route);

  const dispatch = useAppDispatch();

  //TODO:WIP:
  const [connectPortalModalVisible, setConnectPortalModalVisible] = useState(false);
  const [helpCenterToolTipVisible, setHelpCenterToolTipVisible] = useState(false);
  const [visibleFeedback, setVisibleFeedback] = useState(false);

  const { result } = useSelector(getPerconaSettings);
  const { serverId = '' } = useSelector(getPerconaServer);
  const { isOpened: isHelpCenterOpened } = useSelector(getHelpCenterState);
  const isAdmin = contextSrv.isGrafanaAdmin;
  const userId = contextSrv.user.id;
  const styles = getStyles();

  return (
    <>
      {isHelpCenterOpened && <div className={styles.backdrop} onClick={() => dispatch(setHelpCenterOpened(false))} />}

      <ErrorBoundary>
        {({ error, errorInfo }) => {
          if (error) {
            return <GrafanaRouteError error={error} errorInfo={errorInfo} />;
          }

          return (
            <Suspense fallback={<GrafanaRouteLoading />}>
              <PmmUi.StoreProvider>
                {/*MODALS*/}
                <>
                  <PmmUi.ConnectPortalModal
                    onClose={() => setConnectPortalModalVisible(false)}
                    onConfirm={() =>
                      window.open(
                        'https://docs.percona.com/percona-platform/connect-pmm.html?utm_source=pmm&utm_medium=pmm-platform-connection&utm_campaign=modal&utm_term=learn-how-to-connect-Percona-Platform',
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                    isAdmin={isAdmin}
                    isOpen={connectPortalModalVisible}
                  />
                </>

                <PmmUi.TopBar
                  connectedToPortal={result?.isConnectedToPortal}
                  showFeedbackButton
                  showHelpCenterButton
                  pmmServerId={serverId}
                  visibleFeedback={visibleFeedback}
                  setVisibleFeedback={(visibleFeedback: boolean) => {
                    setVisibleFeedback(visibleFeedback);
                    // close help center when open feedback popup
                    if (visibleFeedback) {
                      dispatch(setHelpCenterOpened(false));
                    }
                  }}
                  onSignInClick={() => {
                    setConnectPortalModalVisible(true);
                  }}
                  onHelpCenterClick={() => {
                    dispatch(setHelpCenterOpened(!isHelpCenterOpened));
                    // close feedback popup when open help center
                    if (!isHelpCenterOpened) {
                      setVisibleFeedback(false);
                    }
                  }}
                  showHelpCenterToolTip={helpCenterToolTipVisible}
                  onCloseHelpCenterTooltip={() => setHelpCenterToolTipVisible(false)}
                />

                <PmmUi.HelpCenter
                  open={isHelpCenterOpened}
                  onClose={() => dispatch(setHelpCenterOpened(false))}
                  width="416px"
                  isConnectedUser={result?.isConnectedToPortal}
                  userId={userId}
                  openKeyboardShortcut={() => {
                    appEvents.publish(new ShowModalReactEvent({ component: HelpModal }));
                  }}
                  onConnectToPlatformClick={() => {
                    setConnectPortalModalVisible(true);
                  }}
                />
                {/*TODO:WIP: refactor*/}
                <div className={`${styles.mainContainer} ${isHelpCenterOpened ? styles.openedHelpCenter : ''}`}>
                  {props.location.pathname === '/' ? (
                    <PmmUi.HomePageRouter
                      userId={userId}
                      defaultHomePage={
                        <props.route.component {...props} queryParams={locationSearchToObject(props.location.search)} />
                      }
                      overrideHomePage={<Redirect to={PmmUi.HomePageRoute} />}
                    />
                  ) : props.location.pathname === PmmUi.HomePageRoute ? (
                    <Suspense fallback={<div></div>}>
                      <>
                        <PmmUi.HomePage
                          onHelpCenterButtonClick={() => setHelpCenterToolTipVisible(true)}
                          userId={userId}
                        />
                      </>
                    </Suspense>
                  ) : (
                    <props.route.component {...props} queryParams={locationSearchToObject(props.location.search)} />
                  )}
                </div>
              </PmmUi.StoreProvider>
            </Suspense>
          );
        }}
      </ErrorBoundary>
    </>
  );
}

const getStyles = () => ({
  mainContainer: css`
    width: 100%;
    height: 100%;
    overflow-y: hidden;
  `,
  openedHelpCenter: css`
    width: calc(100% - 430px);
    @media (max-width: 1279px) {
      width: 100%;
    }
  `,
  backdrop: css`
    display: none;
    @media (max-width: 1279px) {
      display: block;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      height: 1000%;
      width: 100%;
      z-index: 1000;
      background-color: rgba(63, 62, 62, 0.45);
      backdrop-filter: blur(1px);
    }
  `,
});

function getPageClasses(route: RouteDescriptor) {
  return route.pageClass ? route.pageClass.split(' ') : [];
}

function updateBodyClassNames(route: RouteDescriptor, clear = false) {
  for (const cls of getPageClasses(route)) {
    if (clear) {
      document.body.classList.remove(cls);
    } else {
      document.body.classList.add(cls);
    }
  }
}

function cleanupDOM() {
  document.body.classList.remove('sidemenu-open--xs');

  // cleanup tooltips
  const tooltipById = document.getElementById('tooltip');
  tooltipById?.parentElement?.removeChild(tooltipById);

  const tooltipsByClass = document.querySelectorAll('.tooltip');
  for (let i = 0; i < tooltipsByClass.length; i++) {
    const tooltip = tooltipsByClass[i];
    tooltip.parentElement?.removeChild(tooltip);
  }

  // cleanup tether-drop
  for (const drop of Drop.drops) {
    drop.destroy();
  }
}
