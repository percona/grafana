import React, { Suspense, useEffect, useState } from 'react';
// @ts-ignore
import Drop from 'tether-drop';

import { locationSearchToObject, navigationLogger, reportPageview } from '@grafana/runtime';
import { ErrorBoundary } from '@grafana/ui';
import { contextSrv } from 'app/core/core';

import { PmmUi } from '../../percona/federation';
import { LocalStorageValueProvider } from "../components/LocalStorageValueProvider";
import { useGrafana } from '../context/GrafanaContext';

import { GrafanaRouteError } from './GrafanaRouteError';
import { GrafanaRouteLoading } from './GrafanaRouteLoading';
import { GrafanaRouteComponentProps, RouteDescriptor } from './types';

export interface Props extends Omit<GrafanaRouteComponentProps, 'queryParams'> {
}

const LOCAL_STORAGE_KEY='grafana.dashboard.navigation.onboarding';

export function GrafanaRoute(props: Props) {
  const {chrome, keybindings}=useGrafana();

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

  //TODO:WIP:
  const [_, setMessage]=useState('');
  const [userContext, setUserContext]=useState('');
  const [connectPortalModalVisible, setConnectPortalModalVisible] = useState(false);
  const [helpCenterToolTipVisiable, setHelpCenterToolTipVisiable] = useState(false);
  const isAdmin = contextSrv.isGrafanaAdmin;

  return (
    <ErrorBoundary>
      {({error, errorInfo}) => {
        if (error) {
          return <GrafanaRouteError error={error} errorInfo={errorInfo}/>;
        }

        return (
          <Suspense fallback={<GrafanaRouteLoading/>}>
            <>
              <LocalStorageValueProvider<boolean> storageKey={LOCAL_STORAGE_KEY} defaultValue={false}>
                {(isHelpCenterOpen, saveHelpCenterOpen) => {
                  return (
                    <>
                      {/*MODALS*/}
                      <>
                        <PmmUi.ConnectPortalModal
                          onClose={() => setConnectPortalModalVisible(false)}
                          onConfirm={() => {
                            setConnectPortalModalVisible(false);
                            setUserContext('something_here');
                          }}
                          isAdmin={isAdmin}
                          isOpen={connectPortalModalVisible}
                        />
                      </>

                      <PmmUi.TopBar
                        userContext={userContext}
                        showSignIn
                        showFeedbackButton
                        showHelpCenterButton
                        showHelpCenterNotificationMarker
                        onSignInClick={() => {
                          setConnectPortalModalVisible(true);
                        }}
                        onHelpCenterClick={() => saveHelpCenterOpen(!isHelpCenterOpen)}
                        onNotificationClick={() => setMessage('notification')}
                        onFeedbackClick={() => setMessage('feedback form')}
                        showHelpCenterToolTip={helpCenterToolTipVisiable}
                        onCloseHelpCenterTooltip={() => setHelpCenterToolTipVisiable(false)}
                      />
                      <PmmUi.HelpCenter
                        open={isHelpCenterOpen}
                        onClose={() => saveHelpCenterOpen(false)}
                        width="416px"
                        isConnectedUser={false}
                      />
                      {/*TODO:WIP: refactor*/}
                      <div style={{"width": isHelpCenterOpen ? 'calc(100% - 430px)' : '100%'}}>
                        {props.location.pathname === '/a/pmm-homescreen-app' ? (
                          <Suspense fallback={<div></div>}>
                            <>
                              <PmmUi.HomePage onHelpCenterButtonClick={() => setHelpCenterToolTipVisiable(true)}/>
                            </>
                          </Suspense>
                        ) : (
                          <props.route.component {...props}
                                                 queryParams={locationSearchToObject(props.location.search)}/>
                        )}
                      </div>
                    </>
                  )
                }}
              </LocalStorageValueProvider>
            </>
          </Suspense>
        );
      }}
    </ErrorBoundary>
  );
}

function getPageClasses(route: RouteDescriptor) {
  return route.pageClass ? route.pageClass.split(' ') : [];
}

function updateBodyClassNames(route: RouteDescriptor, clear=false) {
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
  const tooltipById=document.getElementById('tooltip');
  tooltipById?.parentElement?.removeChild(tooltipById);

  const tooltipsByClass=document.querySelectorAll('.tooltip');
  for (let i=0; i < tooltipsByClass.length; i++) {
    const tooltip=tooltipsByClass[i];
    tooltip.parentElement?.removeChild(tooltip);
  }

  // cleanup tether-drop
  for (const drop of Drop.drops) {
    drop.destroy();
  }
}
