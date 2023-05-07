import React from 'react';

// @ts-ignore
const TopBar = React.lazy(() => import('pmm_ui/TopBar'));
// @ts-ignore
const HomePage = React.lazy(() => import('pmm_ui/HomePage'));
// @ts-ignore
const HelpCenter = React.lazy(() => import('pmm_ui/HelpCenter'));
// @ts-ignore
const ConnectPortalModal = React.lazy(() => import('pmm_ui/ConnectPortalModal'));

// @ts-ignore
const StoreProvider = React.lazy(() => import('pmm_ui/StoreProvider'));

// @ts-ignore
const HomePageRouter = React.lazy(() => import('pmm_ui/HomePageRouter'));

const HomePageRoute = '/a/pmm-homescreen-app';

// @ts-ignore
const PlatformConnectionSettings = React.lazy(() => import('pmm_ui/PlatformConnectionSettings'));

export const PmmUi = {
  TopBar,
  HomePage,
  HelpCenter,
  ConnectPortalModal,
  StoreProvider,
  HomePageRouter,
  HomePageRoute,
  PlatformConnectionSettings,
};
