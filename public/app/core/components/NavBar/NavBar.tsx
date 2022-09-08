import { css, cx } from '@emotion/css';
import { FocusScope } from '@react-aria/focus';
import { useTour } from '@reactour/tour';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { GrafanaTheme2, NavModelItem, NavSection } from '@grafana/data';
import { config, locationService, reportInteraction } from '@grafana/runtime';
import { Icon, useTheme2 } from '@grafana/ui';
import { updateNavIndex } from 'app/core/actions';
import { Branding } from 'app/core/components/Branding/Branding';
import { getKioskMode } from 'app/core/navigation/kiosk';
import { initialState, updateNavTree } from 'app/core/reducers/navBarTree';
import { getPerconaSettings, getPerconaUser } from 'app/percona/shared/core/selectors';
import { KioskMode, StoreState } from 'app/types';

import { OrgSwitcher } from '../OrgSwitcher';

import NavBarItem from './NavBarItem';
import { NavBarItemWithoutMenu } from './NavBarItemWithoutMenu';
import { NavBarMenu } from './NavBarMenu';
import { NavBarMenuPortalContainer } from './NavBarMenuPortalContainer';
import { NavBarScrollContainer } from './NavBarScrollContainer';
import { NavBarToggle } from './NavBarToggle';
import {
  getPmmSettingsPage,
  PMM_ADD_INSTANCE_PAGE,
  PMM_ALERTING_PAGE,
  PMM_BACKUP_PAGE,
  PMM_DBAAS_PAGE,
  PMM_ENTITLEMENTS_PAGE,
  PMM_ENVIRONMENT_OVERVIEW_PAGE,
  PMM_INVENTORY_PAGE,
  PMM_STT_PAGE,
  PMM_TICKETS_PAGE,
} from './constants';
import { NavBarContext } from './context';
import {
  buildIntegratedAlertingMenuItem,
  buildInventoryAndSettings,
  enrichConfigItems,
  enrichWithClickDispatch,
  enrichWithInteractionTracking,
  getActiveItem,
  isMatchOrInnerMatch,
  isSearchActive,
  SEARCH_ITEM_ID,
} from './utils';

const onOpenSearch = () => {
  locationService.partial({ search: 'open' });
};

export const NavBar = React.memo(() => {
  const navBarTree = useSelector((state: StoreState) => state.navBarTree);
  const theme = useTheme2();
  const styles = getStyles(theme);
  const dispatchOffset = theme.transitions.duration.standard;
  const location = useLocation();
  const dispatch = useDispatch();
  const kiosk = getKioskMode();
  const { result } = useSelector(getPerconaSettings);
  const { alertingEnabled } = result!;
  const { isPlatformUser, isAuthorized } = useSelector(getPerconaUser);
  const [showSwitcherModal, setShowSwitcherModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimationInProgress, setMenuAnimationInProgress] = useState(false);
  const [menuIdOpen, setMenuIdOpen] = useState<string | undefined>();
  const { isOpen: isTourOpen } = useTour();

  const toggleSwitcherModal = () => {
    setShowSwitcherModal(!showSwitcherModal);
  };

  // Here we need to hack in a "home" and "search" NavModelItem since this is constructed in the frontend
  const searchItem: NavModelItem = enrichWithInteractionTracking(
    {
      id: SEARCH_ITEM_ID,
      onClick: onOpenSearch,
      text: 'Search dashboards',
      icon: 'search',
    },
    menuOpen
  );

  const homeItem: NavModelItem = enrichWithInteractionTracking(
    {
      id: 'home',
      text: 'Home',
      url: config.appSubUrl || '/',
      icon: 'grafana',
    },
    menuOpen
  );

  const navTree = cloneDeep(navBarTree);

  const coreItems = navTree
    .filter((item) => item.section === NavSection.Core)
    .map((item) => enrichWithInteractionTracking(item, menuOpen))
    .map((item) => enrichWithClickDispatch(item, dispatch, dispatchOffset));
  const pluginItems = navTree
    .filter((item) => item.section === NavSection.Plugin)
    .map((item) => enrichWithInteractionTracking(item, menuOpen))
    .map((item) => enrichWithClickDispatch(item, dispatch, dispatchOffset));
  const configItems = enrichConfigItems(
    navTree.filter((item) => item.section === NavSection.Config),
    location,
    toggleSwitcherModal
  )
    .map((item) => enrichWithInteractionTracking(item, menuOpen))
    .map((item) => enrichWithClickDispatch(item, dispatch, dispatchOffset));

  const activeItem = isSearchActive(location) ? searchItem : getActiveItem(navTree, location.pathname);

  // @PERCONA
  // All these dispatches are our pages
  dispatch(updateNavIndex(getPmmSettingsPage(alertingEnabled)));
  dispatch(updateNavIndex(PMM_ALERTING_PAGE));
  dispatch(updateNavIndex(PMM_STT_PAGE));
  dispatch(updateNavIndex(PMM_DBAAS_PAGE));
  dispatch(updateNavIndex(PMM_BACKUP_PAGE));
  dispatch(updateNavIndex(PMM_INVENTORY_PAGE));
  dispatch(updateNavIndex(PMM_ADD_INSTANCE_PAGE));
  dispatch(updateNavIndex(PMM_TICKETS_PAGE));
  dispatch(updateNavIndex(PMM_ENTITLEMENTS_PAGE));
  dispatch(updateNavIndex(PMM_ENVIRONMENT_OVERVIEW_PAGE));

  // @PERCONA
  useEffect(() => {
    const updatedNavTree = cloneDeep(initialState);

    const { sttEnabled, alertingEnabled, dbaasEnabled, backupEnabled } = result!;

    // @PERCONA
    if (isPlatformUser) {
      updatedNavTree.push(PMM_ENTITLEMENTS_PAGE);
      updatedNavTree.push(PMM_TICKETS_PAGE);
      updatedNavTree.push(PMM_ENVIRONMENT_OVERVIEW_PAGE);
    }

    // @PERCONA
    if (isAuthorized) {
      buildInventoryAndSettings(updatedNavTree);

      if (alertingEnabled) {
        buildIntegratedAlertingMenuItem(updatedNavTree);
      }

      if (sttEnabled) {
        updatedNavTree.push(PMM_STT_PAGE);
      }

      if (dbaasEnabled) {
        updatedNavTree.push(PMM_DBAAS_PAGE);
      }

      if (backupEnabled) {
        updatedNavTree.push(PMM_BACKUP_PAGE);
      }
    }

    dispatch(updateNavTree({ items: updatedNavTree }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, isAuthorized, isPlatformUser]);

  if (kiosk !== KioskMode.Off) {
    return null;
  }
  return (
    <div className={styles.navWrapper}>
      <nav className={cx(styles.sidemenu, 'sidemenu')} data-testid="sidemenu" aria-label="Main menu">
        <NavBarContext.Provider
          value={{
            // Show MySQL item during onboarding tour
            menuIdOpen: isTourOpen ? 'mysql' : menuIdOpen,
            setMenuIdOpen: setMenuIdOpen,
          }}
        >
          <FocusScope>
            <div className={styles.mobileSidemenuLogo} onClick={() => setMenuOpen(!menuOpen)} key="hamburger">
              <Icon name="bars" size="xl" />
            </div>

            <NavBarToggle
              className={styles.menuExpandIcon}
              isExpanded={menuOpen}
              onClick={() => {
                reportInteraction('grafana_navigation_expanded');
                setMenuOpen(true);
              }}
            />

            <NavBarMenuPortalContainer />

            <NavBarItemWithoutMenu
              elClassName={styles.grafanaLogoInner}
              label={homeItem.text}
              className={styles.grafanaLogo}
              url={homeItem.url}
              onClick={homeItem.onClick}
            >
              <Branding.MenuLogo />
            </NavBarItemWithoutMenu>

            <NavBarScrollContainer>
              <ul className={styles.itemList}>
                <NavBarItem className={styles.search} isActive={activeItem === searchItem} link={searchItem} />

                {coreItems.map((link, index) => (
                  <NavBarItem
                    key={`${link.id}-${index}`}
                    isActive={isMatchOrInnerMatch(link, activeItem)}
                    link={{ ...link, subTitle: undefined }}
                  />
                ))}

                {pluginItems.length > 0 &&
                  pluginItems.map((link, index) => (
                    <NavBarItem
                      key={`${link.id}-${index}`}
                      isActive={isMatchOrInnerMatch(link, activeItem)}
                      link={link}
                    />
                  ))}

                {configItems.map((link, index) => (
                  <NavBarItem
                    key={`${link.id}-${index}`}
                    isActive={isMatchOrInnerMatch(link, activeItem)}
                    reverseMenuDirection
                    link={link}
                    className={cx({ [styles.verticalSpacer]: index === 0 })}
                  />
                ))}
              </ul>
            </NavBarScrollContainer>
          </FocusScope>
        </NavBarContext.Provider>
      </nav>
      {showSwitcherModal && <OrgSwitcher onDismiss={toggleSwitcherModal} />}
      {(menuOpen || menuAnimationInProgress) && (
        <div className={styles.menuWrapper}>
          <NavBarMenu
            activeItem={activeItem}
            isOpen={menuOpen}
            setMenuAnimationInProgress={setMenuAnimationInProgress}
            navItems={[homeItem, searchItem, ...coreItems, ...pluginItems, ...configItems]}
            onClose={() => setMenuOpen(false)}
          />
        </div>
      )}
    </div>
  );
});

NavBar.displayName = 'NavBar';

const getStyles = (theme: GrafanaTheme2) => ({
  navWrapper: css({
    position: 'relative',
    display: 'flex',

    '.sidemenu-hidden &': {
      display: 'none',
    },
  }),
  sidemenu: css({
    label: 'sidemenu',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.background.primary,
    zIndex: theme.zIndex.sidemenu,
    padding: `${theme.spacing(1)} 0`,
    position: 'relative',
    width: theme.components.sidemenu.width,
    borderRight: `1px solid ${theme.colors.border.weak}`,

    [theme.breakpoints.down('md')]: {
      height: theme.spacing(7),
      position: 'fixed',
      paddingTop: '0px',
      backgroundColor: 'inherit',
      borderRight: 0,
    },
  }),
  mobileSidemenuLogo: css({
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(2),

    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  }),
  itemList: css({
    backgroundColor: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',

    [theme.breakpoints.down('md')]: {
      visibility: 'hidden',
    },
  }),
  grafanaLogo: css({
    alignItems: 'stretch',
    display: 'flex',
    flexShrink: 0,
    height: theme.spacing(6),
    justifyContent: 'stretch',

    [theme.breakpoints.down('md')]: {
      visibility: 'hidden',
    },
  }),
  grafanaLogoInner: css({
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    width: '100%',

    '> div': {
      height: 'auto',
      width: 'auto',
    },
  }),
  search: css({
    display: 'none',
    marginTop: 0,

    [theme.breakpoints.up('md')]: {
      display: 'grid',
    },
  }),
  verticalSpacer: css({
    marginTop: 'auto',
  }),
  hideFromMobile: css({
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  }),
  menuWrapper: css({
    position: 'fixed',
    display: 'grid',
    gridAutoFlow: 'column',
    height: '100%',
    zIndex: theme.zIndex.sidemenu,
  }),
  menuExpandIcon: css({
    position: 'absolute',
    top: '43px',
    right: '0px',
    transform: `translateX(50%)`,
  }),
  menuPortalContainer: css({
    zIndex: theme.zIndex.sidemenu,
  }),
});
