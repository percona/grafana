import React from 'react';

// @ts-ignore
const TopBar = React.lazy(() => import('pmm_ui/TopBar'));
// @ts-ignore
const HomePage = React.lazy(() => import('pmm_ui/HomePage'));
// @ts-ignore
const HelpCenter = React.lazy(() => import('pmm_ui/HelpCenter'));

export const PmmUi = {
  TopBar,
  HomePage,
  HelpCenter,
};
