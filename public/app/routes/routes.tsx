import React from 'react';
import { Redirect } from 'react-router-dom';

import { NavLandingPage } from 'app/core/components/AppChrome/NavLandingPage';
import ErrorPage from 'app/core/components/ErrorPage/ErrorPage';
import { LoginPage } from 'app/core/components/Login/LoginPage';
import config from 'app/core/config';
import { contextSrv } from 'app/core/services/context_srv';
import UserAdminPage from 'app/features/admin/UserAdminPage';
import LdapPage from 'app/features/admin/ldap/LdapPage';
import { getAlertingRoutes } from 'app/features/alerting/routes';
import { getRoutes as getDataConnectionsRoutes } from 'app/features/data-connections/routes';
import { DATASOURCES_ROUTES } from 'app/features/datasources/constants';
import { getLiveRoutes } from 'app/features/live/pages/routes';
import { getRoutes as getPluginCatalogRoutes } from 'app/features/plugins/admin/routes';
import { getProfileRoutes } from 'app/features/profile/routes';
import { ServiceAccountPage } from 'app/features/serviceaccounts/ServiceAccountPage';
import { AccessControlAction, DashboardRoutes } from 'app/types';

import { SafeDynamicImport } from '../core/components/DynamicImports/SafeDynamicImport';
import { RouteDescriptor } from '../core/navigation/types';
import { getPublicDashboardRoutes } from '../features/dashboard/routes';
import { DBAAS_URL } from '../percona/dbaas/DBaaS.constants';
import {
  DB_CLUSTER_CREATION_URL,
  DB_CLUSTER_EDIT_URL,
  DB_CLUSTER_INVENTORY_URL,
} from '../percona/dbaas/components/DBCluster/EditDBClusterPage/EditDBClusterPage.constants';
import { K8S_INVENTORY_URL } from '../percona/dbaas/components/Kubernetes/EditK8sClusterPage/EditK8sClusterPage.constants';

import { pluginHasRootPage } from './utils';

export const extraRoutes: RouteDescriptor[] = [];

export function getAppRoutes(): RouteDescriptor[] {
  const topnavRoutes: RouteDescriptor[] = config.featureToggles.topnav
    ? [
        {
          path: '/apps',
          component: () => <NavLandingPage navId="apps" />,
        },
        {
          path: '/a/:pluginId',
          exact: true,
          component: (props) => {
            const hasRoot = pluginHasRootPage(props.match.params.pluginId, config.bootData.navTree);
            const hasQueryParams = Object.keys(props.queryParams).length > 0;
            if (hasRoot || hasQueryParams) {
              const AppRootPage = SafeDynamicImport(
                () => import(/* webpackChunkName: "AppRootPage" */ 'app/features/plugins/components/AppRootPage')
              );
              return <AppRootPage {...props} />;
            } else {
              return <NavLandingPage navId={`plugin-page-${props.match.params.pluginId}`} />;
            }
          },
        },
      ]
    : [];

  return [
    {
      path: '/',
      pageClass: 'page-dashboard',
      routeName: DashboardRoutes.Home,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardPage" */ '../features/dashboard/containers/DashboardPage')
      ),
    },
    {
      path: '/d/:uid/:slug?',
      pageClass: 'page-dashboard',
      routeName: DashboardRoutes.Normal,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardPage" */ '../features/dashboard/containers/DashboardPage')
      ),
    },
    {
      path: '/dashboard/:type/:slug',
      pageClass: 'page-dashboard',
      routeName: DashboardRoutes.Normal,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardPage" */ '../features/dashboard/containers/DashboardPage')
      ),
    },
    {
      path: '/dashboard/new',
      pageClass: 'page-dashboard',
      routeName: DashboardRoutes.New,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardPage" */ '../features/dashboard/containers/DashboardPage')
      ),
    },
    {
      path: '/d-solo/:uid/:slug',
      pageClass: 'dashboard-solo',
      routeName: DashboardRoutes.Normal,
      chromeless: true,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SoloPanelPage" */ '../features/dashboard/containers/SoloPanelPage')
      ),
    },
    // This route handles embedding of snapshot/scripted dashboard panels
    {
      path: '/dashboard-solo/:type/:slug',
      pageClass: 'dashboard-solo',
      routeName: DashboardRoutes.Normal,
      chromeless: true,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SoloPanelPage" */ '../features/dashboard/containers/SoloPanelPage')
      ),
    },
    {
      path: '/d-solo/:uid',
      pageClass: 'dashboard-solo',
      routeName: DashboardRoutes.Normal,
      chromeless: true,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SoloPanelPage" */ '../features/dashboard/containers/SoloPanelPage')
      ),
    },
    {
      path: '/dashboard/import',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardImport"*/ 'app/features/manage-dashboards/DashboardImportPage')
      ),
    },
    {
      path: DATASOURCES_ROUTES.List,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DataSourcesListPage"*/ 'app/features/datasources/pages/DataSourcesListPage')
      ),
    },
    {
      path: DATASOURCES_ROUTES.Edit,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "EditDataSourcePage"*/ '../features/datasources/pages/EditDataSourcePage')
      ),
    },
    {
      path: DATASOURCES_ROUTES.Dashboards,
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "DataSourceDashboards"*/ 'app/features/datasources/pages/DataSourceDashboardsPage'
          )
      ),
    },
    {
      path: DATASOURCES_ROUTES.New,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "NewDataSourcePage"*/ '../features/datasources/pages/NewDataSourcePage')
      ),
    },
    {
      path: '/datasources/correlations',
      component: SafeDynamicImport(() =>
        config.featureToggles.correlations
          ? import(/* webpackChunkName: "CorrelationsPage" */ 'app/features/correlations/CorrelationsPage')
          : import(
              /* webpackChunkName: "CorrelationsFeatureToggle" */ 'app/features/correlations/CorrelationsFeatureToggle'
            )
      ),
    },
    {
      path: '/dashboards',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardListPage"*/ 'app/features/search/components/DashboardListPage')
      ),
    },
    {
      path: '/dashboards/folder/new',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "NewDashboardsFolder"*/ 'app/features/folders/components/NewDashboardsFolder')
      ),
    },
    {
      path: '/dashboards/f/:uid/:slug/permissions',
      component:
        config.rbacEnabled && contextSrv.hasPermission(AccessControlAction.FoldersPermissionsRead)
          ? SafeDynamicImport(
              () =>
                import(/* webpackChunkName: "FolderPermissions"*/ 'app/features/folders/AccessControlFolderPermissions')
            )
          : SafeDynamicImport(
              () => import(/* webpackChunkName: "FolderPermissions"*/ 'app/features/folders/FolderPermissions')
            ),
    },
    {
      path: '/dashboards/f/:uid/:slug/settings',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "FolderSettingsPage"*/ 'app/features/folders/FolderSettingsPage')
      ),
    },
    {
      path: '/dashboards/f/:uid/:slug',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardListPage"*/ 'app/features/search/components/DashboardListPage')
      ),
    },
    {
      path: '/dashboards/f/:uid',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardListPage"*/ 'app/features/search/components/DashboardListPage')
      ),
    },
    {
      path: '/explore',
      pageClass: 'page-explore',
      roles: () =>
        contextSrv.evaluatePermission(
          () => (config.viewersCanEdit ? [] : ['Editor', 'Admin']),
          [AccessControlAction.DataSourcesExplore]
        ),
      component: SafeDynamicImport(() =>
        config.exploreEnabled
          ? import(/* webpackChunkName: "explore" */ 'app/features/explore/Wrapper')
          : import(/* webpackChunkName: "explore-feature-toggle-page" */ 'app/features/explore/FeatureTogglePage')
      ),
    },
    ...topnavRoutes,
    {
      path: '/a/:pluginId',
      exact: false,
      // Someday * and will get a ReactRouter under that path!
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AppRootPage" */ 'app/features/plugins/components/AppRootPage')
      ),
    },
    {
      path: '/org',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "OrgDetailsPage" */ '../features/org/OrgDetailsPage')
      ),
    },
    {
      path: '/org/new',
      component: SafeDynamicImport(() => import(/* webpackChunkName: "NewOrgPage" */ 'app/features/org/NewOrgPage')),
    },
    {
      path: '/org/users',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "UsersListPage" */ 'app/features/users/UsersListPage')
      ),
    },
    {
      path: '/org/users/invite',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "UserInvitePage" */ 'app/features/org/UserInvitePage')
      ),
    },
    {
      path: '/org/apikeys',
      roles: () => contextSrv.evaluatePermission(() => ['Admin'], [AccessControlAction.ActionAPIKeysRead]),
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "ApiKeysPage" */ 'app/features/api-keys/ApiKeysPage')
      ),
    },
    {
      path: '/org/serviceaccounts',
      roles: () =>
        contextSrv.evaluatePermission(
          () => ['Admin'],
          [AccessControlAction.ServiceAccountsRead, AccessControlAction.ServiceAccountsCreate]
        ),
      component: SafeDynamicImport(
        () =>
          import(/* webpackChunkName: "ServiceAccountsPage" */ 'app/features/serviceaccounts/ServiceAccountsListPage')
      ),
    },
    {
      path: '/org/serviceaccounts/create',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "ServiceAccountCreatePage" */ 'app/features/serviceaccounts/ServiceAccountCreatePage'
          )
      ),
    },
    {
      path: '/org/serviceaccounts/:id',
      component: ServiceAccountPage,
    },
    {
      path: '/org/teams',
      roles: () =>
        contextSrv.evaluatePermission(
          () => (config.editorsCanAdmin ? ['Editor', 'Admin'] : ['Admin']),
          [AccessControlAction.ActionTeamsRead, AccessControlAction.ActionTeamsCreate]
        ),
      component: SafeDynamicImport(() => import(/* webpackChunkName: "TeamList" */ 'app/features/teams/TeamList')),
    },
    {
      path: '/org/teams/new',
      roles: () =>
        contextSrv.evaluatePermission(
          () => (config.editorsCanAdmin ? ['Editor', 'Admin'] : ['Admin']),
          [AccessControlAction.ActionTeamsCreate]
        ),
      component: SafeDynamicImport(() => import(/* webpackChunkName: "CreateTeam" */ 'app/features/teams/CreateTeam')),
    },
    {
      path: '/org/teams/edit/:id/:page?',
      roles: () =>
        contextSrv.evaluatePermission(
          () => (config.editorsCanAdmin ? ['Editor', 'Admin'] : ['Admin']),
          [AccessControlAction.ActionTeamsRead, AccessControlAction.ActionTeamsCreate]
        ),
      component: SafeDynamicImport(() => import(/* webpackChunkName: "TeamPages" */ 'app/features/teams/TeamPages')),
    },
    // ADMIN
    {
      path: '/admin',
      component: () => (config.featureToggles.topnav ? <NavLandingPage navId="cfg" /> : <Redirect to="/admin/users" />),
    },
    {
      path: '/admin/server',
      component: () =>
        config.featureToggles.topnav ? <NavLandingPage navId="admin" /> : <Redirect to="/admin/users" />,
    },
    {
      path: '/admin/settings',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AdminSettings" */ 'app/features/admin/AdminSettings')
      ),
    },
    {
      path: '/admin/upgrading',
      component: SafeDynamicImport(() => import('app/features/admin/UpgradePage')),
    },
    {
      path: '/admin/users',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "UserListAdminPage" */ 'app/features/admin/UserListAdminPage')
      ),
    },
    {
      path: '/admin/users/create',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "UserCreatePage" */ 'app/features/admin/UserCreatePage')
      ),
    },
    {
      path: '/admin/users/edit/:id',
      component: UserAdminPage,
    },
    {
      path: '/admin/orgs',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AdminListOrgsPage" */ 'app/features/admin/AdminListOrgsPage')
      ),
    },
    {
      path: '/admin/orgs/edit/:id',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AdminEditOrgPage" */ 'app/features/admin/AdminEditOrgPage')
      ),
    },
    {
      path: '/admin/storage/:path*',
      roles: () => ['Admin'],
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "StoragePage" */ 'app/features/storage/StoragePage')
      ),
    },
    {
      path: '/admin/stats',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "ServerStats" */ 'app/features/admin/ServerStats')
      ),
    },
    {
      path: '/admin/ldap',
      component: LdapPage,
    },
    // LOGIN / SIGNUP
    {
      path: '/login',
      component: LoginPage,
      pageClass: 'login-page sidemenu-hidden',
      chromeless: true,
    },
    {
      path: '/invite/:code',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SignupInvited" */ 'app/features/invites/SignupInvited')
      ),
      pageClass: 'sidemenu-hidden',
      chromeless: true,
    },
    {
      path: '/verify',
      component: !config.verifyEmailEnabled
        ? () => <Redirect to="/signup" />
        : SafeDynamicImport(
            () => import(/* webpackChunkName "VerifyEmailPage"*/ 'app/core/components/Signup/VerifyEmailPage')
          ),
      pageClass: 'login-page sidemenu-hidden',
      chromeless: true,
    },
    {
      path: '/signup',
      component: config.disableUserSignUp
        ? () => <Redirect to="/login" />
        : SafeDynamicImport(() => import(/* webpackChunkName "SignupPage"*/ 'app/core/components/Signup/SignupPage')),
      pageClass: 'sidemenu-hidden login-page',
      chromeless: true,
    },
    {
      path: '/user/password/send-reset-email',
      pageClass: 'sidemenu-hidden',
      chromeless: true,
      component: SafeDynamicImport(
        () =>
          import(/* webpackChunkName: "SendResetMailPage" */ 'app/core/components/ForgottenPassword/SendResetMailPage')
      ),
    },
    {
      path: '/user/password/reset',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "ChangePasswordPage" */ 'app/core/components/ForgottenPassword/ChangePasswordPage'
          )
      ),
      pageClass: 'sidemenu-hidden login-page',
      chromeless: true,
    },
    {
      path: '/dashboard/snapshots',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SnapshotListPage" */ 'app/features/manage-dashboards/SnapshotListPage')
      ),
    },
    {
      path: '/playlists',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "PlaylistPage"*/ 'app/features/playlist/PlaylistPage')
      ),
    },
    {
      path: '/playlists/play/:uid',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "PlaylistStartPage"*/ 'app/features/playlist/PlaylistStartPage')
      ),
    },
    {
      path: '/playlists/new',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "PlaylistNewPage"*/ 'app/features/playlist/PlaylistNewPage')
      ),
    },
    {
      path: '/playlists/edit/:uid',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "PlaylistEditPage"*/ 'app/features/playlist/PlaylistEditPage')
      ),
    },
    {
      path: '/sandbox/benchmarks',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "BenchmarksPage"*/ 'app/features/sandbox/BenchmarksPage')
      ),
    },
    {
      path: '/sandbox/test',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "TestStuffPage"*/ 'app/features/sandbox/TestStuffPage')
      ),
    },
    {
      path: '/dashboards/f/:uid/:slug/library-panels',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "FolderLibraryPanelsPage"*/ 'app/features/folders/FolderLibraryPanelsPage')
      ),
    },
    {
      path: '/dashboards/f/:uid/:slug/alerting',
      roles: () =>
        contextSrv.evaluatePermission(() => ['Viewer', 'Editor', 'Admin'], [AccessControlAction.AlertingRuleRead]),
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "FolderAlerting"*/ 'app/features/folders/FolderAlerting')
      ),
    },
    {
      path: '/library-panels',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "LibraryPanelsPage"*/ 'app/features/library-panels/LibraryPanelsPage')
      ),
    },
    {
      path: '/notifications',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "NotificationsPage"*/ 'app/features/notifications/NotificationsPage')
      ),
    },
    {
      path: '/alerting/alerts',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "IntegratedAlertingAlerts" */ 'app/percona/integrated-alerting/components/Alerts/Alerts'
          )
      ),
    },
    {
      path: '/alerting/alert-rule-templates',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "IntegratedAlertingTemplates" */ 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate'
          )
      ),
    },
    {
      path: DBAAS_URL,
      // eslint-disable-next-line react/display-name
      component: SafeDynamicImport(
        () =>
          import(/* webpackChunkName: "DbaaSKubernetesPage" */ 'app/percona/dbaas/components/DBaasRouting/DBaaSRouting')
      ),
    },
    {
      path: K8S_INVENTORY_URL,
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "DbaaSKubernetesPage" */ 'app/percona/dbaas/components/Kubernetes/K8sRouting/K8sRouting'
          )
      ),
    },
    {
      path: '/dbaas/kubernetes/registration',
      // eslint-disable-next-line react/display-name
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "DbaaSKubernetesPage" */ 'app/percona/dbaas/components/Kubernetes/EditK8sClusterPage/EditK8sClusterPage'
          )
      ),
    },
    {
      path: DB_CLUSTER_INVENTORY_URL,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DbaaSClustersPage" */ 'app/percona/dbaas/components/DBCluster/DBCluster')
      ),
    },
    {
      path: DB_CLUSTER_CREATION_URL,
      // eslint-disable-next-line react/display-name
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "DbaaSKubernetesPage" */ 'app/percona/dbaas/components/DBCluster/EditDBClusterPage/EditDBClusterPage'
          )
      ),
    },
    {
      path: DB_CLUSTER_EDIT_URL,
      // eslint-disable-next-line react/display-name
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "DbaaSKubernetesPage" */ 'app/percona/dbaas/components/DBCluster/EditDBClusterPage/EditDBClusterPage'
          )
      ),
    },
    {
      path: '/backup',
      // eslint-disable-next-line react/display-name
      component: () => <Redirect to="/backup/inventory" />,
    },
    {
      path: '/backup/inventory',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "BackupInventoryPage" */ 'app/percona/backup/components/BackupInventory/BackupInventory'
          )
      ),
    },
    {
      path: '/backup/new',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "BackupInventoryPage" */ 'app/percona/backup/components/AddBackupPage/AddBackupPage'
          )
      ),
    },
    {
      path: '/backup/:type/:id/edit',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "BackupInventoryPage" */ 'app/percona/backup/components/AddBackupPage/AddBackupPage'
          )
      ),
    },
    {
      path: '/backup/restore',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "BackupRestorePage" */ 'app/percona/backup/components/RestoreHistory/RestoreHistory'
          )
      ),
    },
    {
      path: '/backup/scheduled',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "BackupScheduledPage" */ 'app/percona/backup/components/ScheduledBackups/ScheduledBackups'
          )
      ),
    },
    {
      path: '/backup/locations',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "BackupLocationsPage" */ 'app/percona/backup/components/StorageLocations/StorageLocations'
          )
      ),
    },
    {
      path: '/advisors',
      // eslint-disable-next-line react/display-name
      component: () => <Redirect to="/advisors/insights" />,
    },
    {
      path: '/pmm-database-checks',
      // eslint-disable-next-line react/display-name
      component: () => <Redirect to="/advisors/insights" />,
    },
    {
      path: '/pmm-database-checks/failed-checks',
      // eslint-disable-next-line react/display-name
      component: () => <Redirect to="/advisors/insights" />,
    },
    {
      path: '/pmm-database-checks/all-checks',
      // eslint-disable-next-line react/display-name
      component: () => <Redirect to="/advisors/insights" />,
    },
    {
      path: '/advisors/insights',
      // eslint-disable-next-line react/display-name
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "FailedChecksPage" */ 'app/percona/check/components/FailedChecksTab/FailedChecksTab'
          )
      ),
    },
    {
      path: '/advisors/insights/:service',
      component: SafeDynamicImport(
        () =>
          import(/* webpackChunkName: "FailedChecksPage" */ 'app/percona/check/components/ServiceChecks/ServiceChecks')
      ),
    },
    {
      path: '/advisors/:category',
      // eslint-disable-next-line react/display-name
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AllChecksPage" */ 'app/percona/check/components/AllChecksTab/AllChecksTab')
      ),
    },
    {
      path: '/settings',
      // eslint-disable-next-line react/display-name
      component: () => <Redirect to="/settings/metrics-resolution" />,
    },
    {
      path: '/settings/metrics-resolution',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "MetricsResolutionsSettingsPage" */ 'app/percona/settings/components/MetricsResolution/MetricsResolution'
          )
      ),
    },
    {
      path: '/settings/advanced-settings',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AdvancedSettingsPage" */ 'app/percona/settings/components/Advanced/Advanced')
      ),
    },
    {
      path: '/settings/ssh-key',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SSHKeySettingsPage" */ 'app/percona/settings/components/SSHKey/SSHKey')
      ),
    },
    {
      path: '/settings/am-integration',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "AMIntegrationSettingsPage" */ 'app/percona/settings/components/AlertManager/AlertManager'
          )
      ),
    },
    {
      path: '/settings/percona-platform',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "PerconaPlatformSettingsPage" */ 'app/percona/settings/components/Platform/Platform'
          )
      ),
    },
    {
      path: '/settings/communication',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "CommunicationSettingsPage" */ 'app/percona/settings/components/Communication/Communication'
          )
      ),
    },
    {
      path: '/settings/metrics-resolution',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "MetricsResolutionsPage" */ 'app/percona/settings/components/MetricsResolution/MetricsResolution'
          )
      ),
    },
    {
      path: '/inventory',
      // eslint-disable-next-line react/display-name
      component: () => <Redirect to="/inventory/services" />,
    },
    {
      path: '/inventory/services',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "InventoryServicesPage" */ 'app/percona/inventory/Tabs/Services')
      ),
    },
    {
      path: '/inventory/services/:serviceId/agents',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "InventoryAgentsPage" */ 'app/percona/inventory/Tabs/Agents')
      ),
    },
    {
      path: '/inventory/nodes',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "InventoryNodesPage" */ 'app/percona/inventory/Tabs/Nodes')
      ),
    },
    {
      path: '/inventory/nodes/:nodeId/agents',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "InventoryAgentsPage" */ 'app/percona/inventory/Tabs/Agents')
      ),
    },
    {
      path: '/add-instance',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AddInstancePage" */ 'app/percona/add-instance/panel')
      ),
    },
    {
      path: '/add-instance/:instanceType',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AddInstancePage" */ 'app/percona/add-instance/panel')
      ),
    },
    {
      path: '/edit-instance/:serviceId',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AddInstancePage" */ 'app/percona/edit-instance/EditInstance')
      ),
    },
    {
      path: '/add-instance/:tab',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AddInstancePage" */ 'app/percona/add-instance/panel')
      ),
    },
    {
      path: '/entitlements',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AddInstancePage" */ 'app/percona/entitlements/EntitlementsPage')
      ),
    },
    {
      path: '/tickets',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "TicketsPage" */ 'app/percona/tickets/TicketsPage')
      ),
    },
    {
      path: '/roles',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AccessRolesPage" */ 'app/percona/rbac/AccessRoles/AccessRoles')
      ),
    },
    {
      path: '/roles/:id/edit',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AccessRoleEditPage" */ 'app/percona/rbac/AddEditRole/EditRolePage')
      ),
    },
    {
      path: '/roles/create',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AccessRoleCreatePage" */ 'app/percona/rbac/AddEditRole/AddRolePage')
      ),
    },
    {
      path: '/environment-overview',
      component: SafeDynamicImport(
        () =>
          import(/* webpackChunkName: "EnvironmentOverview" */ 'app/percona/environment-overview/EnvironmentOverview')
      ),
    },
    {
      path: '/pmm-dump',
      component: SafeDynamicImport(() => import(/* webpackChunkName: "PMMDump" */ 'app/percona/pmm-dump/PMMDump')),
    },
    {
      path: '/pmm-dump/new',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "BackupInventoryPage" */ 'app/percona/pmm-dump/components/ExportDataset/ExportDataset'
          )
      ),
    },
    ...getBrowseStorageRoutes(),
    ...getDynamicDashboardRoutes(),
    ...getPluginCatalogRoutes(),
    ...getLiveRoutes(),
    ...getAlertingRoutes(),
    ...getProfileRoutes(),
    ...extraRoutes,
    ...getPublicDashboardRoutes(),
    ...getDataConnectionsRoutes(),
    {
      path: '/*',
      component: ErrorPage,
    },
    // TODO[Router]
    // ...playlistRoutes,
  ];
}

export function getBrowseStorageRoutes(cfg = config): RouteDescriptor[] {
  if (!cfg.featureToggles.dashboardsFromStorage) {
    return [];
  }
  return [
    {
      path: '/g/:slug*.json', // suffix will eventually include dashboard
      pageClass: 'page-dashboard',
      routeName: DashboardRoutes.Path,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardPage" */ '../features/dashboard/containers/DashboardPage')
      ),
    },
    {
      path: '/g/:slug*',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "StorageFolderPage" */ '../features/storage/StorageFolderPage')
      ),
    },
  ];
}

export function getDynamicDashboardRoutes(cfg = config): RouteDescriptor[] {
  if (!cfg.featureToggles.scenes) {
    return [];
  }
  return [
    {
      path: '/scenes',
      component: SafeDynamicImport(() => import(/* webpackChunkName: "scenes"*/ 'app/features/scenes/SceneListPage')),
    },
    {
      path: '/scenes/:name',
      component: SafeDynamicImport(() => import(/* webpackChunkName: "scenes"*/ 'app/features/scenes/ScenePage')),
    },
  ];
}
