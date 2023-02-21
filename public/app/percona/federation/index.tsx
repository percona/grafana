import React from 'react';

// @ts-ignore
const NavBar = React.lazy(() => import('pmm_ui/NavBar'));
// @ts-ignore
const HomePage = React.lazy(() => import('pmm_ui/HomePage'));

export const PmmUi = {
  NavBar,
  HomePage,
};
