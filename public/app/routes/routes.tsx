import React from 'react';
import LdapPage from 'app/features/admin/ldap/LdapPage';
import UserAdminPage from 'app/features/admin/UserAdminPage';
import { LoginPage } from 'app/core/components/Login/LoginPage';
import config from 'app/core/config';
import { AccessControlAction, DashboardRoutes } from 'app/types';
import { SafeDynamicImport } from '../core/components/DynamicImports/SafeDynamicImport';
import { RouteDescriptor } from '../core/navigation/types';
import { Redirect } from 'react-router-dom';
import ErrorPage from 'app/core/components/ErrorPage/ErrorPage';
import { getRoutes as getPluginCatalogRoutes } from 'app/features/plugins/admin/routes';
import { contextSrv } from 'app/core/services/context_srv';
import { getLiveRoutes } from 'app/features/live/pages/routes';
import { getAlertingRoutes } from 'app/features/alerting/routes';

export const extraRoutes: RouteDescriptor[] = [];

export function getAppRoutes(): RouteDescriptor[] {
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
      // TODO[Router]
      //roles: () => (contextSrv.hasEditPermissionInFolders ? [contextSrv.user.orgRole] : ['Admin']),
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardPage" */ '../features/dashboard/containers/DashboardPage')
      ),
    },
    {
      path: '/d-solo/:uid/:slug',
      pageClass: 'dashboard-solo',
      routeName: DashboardRoutes.Normal,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SoloPanelPage" */ '../features/dashboard/containers/SoloPanelPage')
      ),
    },
    {
      path: '/d-solo/:uid',
      pageClass: 'dashboard-solo',
      routeName: DashboardRoutes.Normal,
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
      path: '/datasources',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DataSourcesListPage"*/ 'app/features/datasources/DataSourcesListPage')
      ),
    },
    {
      path: '/datasources/edit/:uid/',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "DataSourceSettingsPage"*/ '../features/datasources/settings/DataSourceSettingsPage'
          )
      ),
    },
    {
      path: '/datasources/edit/:uid/dashboards',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DataSourceDashboards"*/ 'app/features/datasources/DataSourceDashboards')
      ),
    },
    {
      path: '/datasources/new',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "NewDataSourcePage"*/ '../features/datasources/NewDataSourcePage')
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
      component: SafeDynamicImport(
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
        contextSrv.evaluatePermission(() => (config.viewersCanEdit ? [] : ['Editor', 'Admin']), [
          AccessControlAction.DataSourcesExplore,
        ]),
      component: SafeDynamicImport(() => import(/* webpackChunkName: "explore" */ 'app/features/explore/Wrapper')),
    },
    {
      path: '/a/:pluginId/',
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
      roles: () => ['Editor', 'Admin'],
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "ApiKeysPage" */ 'app/features/api-keys/ApiKeysPage')
      ),
    },
    {
      path: '/org/teams',
      roles: () => (config.editorsCanAdmin ? [] : ['Editor', 'Admin']),
      component: SafeDynamicImport(() => import(/* webpackChunkName: "TeamList" */ 'app/features/teams/TeamList')),
    },
    {
      path: '/org/teams/new',

      roles: () => (config.editorsCanAdmin ? [] : ['Admin']),
      component: SafeDynamicImport(() => import(/* webpackChunkName: "CreateTeam" */ 'app/features/teams/CreateTeam')),
    },
    {
      path: '/org/teams/edit/:id/:page?',
      roles: () => (config.editorsCanAdmin ? [] : ['Admin']),
      component: SafeDynamicImport(() => import(/* webpackChunkName: "TeamPages" */ 'app/features/teams/TeamPages')),
    },
    {
      path: '/profile',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "UserProfileEditPage" */ 'app/features/profile/UserProfileEditPage')
      ),
    },
    {
      path: '/profile/password',
      component: SafeDynamicImport(
        () => import(/* webPackChunkName: "ChangePasswordPage" */ 'app/features/profile/ChangePasswordPage')
      ),
    },
    {
      path: '/profile/select-org',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SelectOrgPage" */ 'app/features/org/SelectOrgPage')
      ),
    },
    // ADMIN

    {
      path: '/admin',
      // eslint-disable-next-line react/display-name
      component: () => <Redirect to="/admin/users" />,
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
    },
    {
      path: '/invite/:code',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SignupInvited" */ 'app/features/users/SignupInvited')
      ),
      pageClass: 'sidemenu-hidden',
    },
    {
      path: '/verify',
      component: !config.verifyEmailEnabled
        ? () => <Redirect to="/signup" />
        : SafeDynamicImport(
            () => import(/* webpackChunkName "VerifyEmailPage"*/ 'app/core/components/Signup/VerifyEmailPage')
          ),
      pageClass: 'login-page sidemenu-hidden',
    },
    {
      path: '/signup',
      component: config.disableUserSignUp
        ? () => <Redirect to="/login" />
        : SafeDynamicImport(() => import(/* webpackChunkName "SignupPage"*/ 'app/core/components/Signup/SignupPage')),
      pageClass: 'sidemenu-hidden login-page',
    },
    {
      path: '/user/password/send-reset-email',
      pageClass: 'sidemenu-hidden',
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
      path: '/playlists/play/:id',
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
      path: '/playlists/edit/:id',
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
      path: '/library-panels',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "LibraryPanelsPage"*/ 'app/features/library-panels/LibraryPanelsPage')
      ),
    },
    {
      path: '/integrated-alerting',
      // eslint-disable-next-line react/display-name
      component: () => <Redirect to="/integrated-alerting/alerts" />,
    },
    {
      path: '/integrated-alerting/alerts',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "IntegratedAlertingAlerts" */ 'app/percona/integrated-alerting/components/Alerts/Alerts'
          )
      ),
    },
    {
      path: '/integrated-alerting/alert-rule-templates',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "IntegratedAlertingTemplates" */ 'app/percona/integrated-alerting/components/AlertRuleTemplate/AlertRuleTemplate'
          )
      ),
    },
    {
      path: '/integrated-alerting/notification-channels',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "IntegratedAlertingChannels" */ 'app/percona/integrated-alerting/components/NotificationChannel/NotificationChannel'
          )
      ),
    },
    {
      path: '/integrated-alerting/alert-rules',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "IntegratedAlertingRules" */ 'app/percona/integrated-alerting/components/AlertRules/AlertRules'
          )
      ),
    },
    {
      path: '/dbaas',
      // eslint-disable-next-line react/display-name
      component: () => <Redirect to="/dbaas/kubernetes" />,
    },
    {
      path: '/dbaas/kubernetes',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "DbaaSKubernetesPage" */ 'app/percona/dbaas/components/Kubernetes/KubernetesInventory'
          )
      ),
    },
    {
      path: '/dbaas/dbclusters',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DbaaSClustersPage" */ 'app/percona/dbaas/components/DBCluster/DBCluster')
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
      path: '/pmm-database-checks',
      // eslint-disable-next-line react/display-name
      component: () => <Redirect to="/pmm-database-checks/failed-checks" />,
    },
    {
      path: '/pmm-database-checks/failed-checks',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "FailedChecksPage" */ 'app/percona/check/components/FailedChecksTab/FailedChecksTab'
          )
      ),
    },
    {
      path: '/pmm-database-checks/failed-checks/:service',
      component: SafeDynamicImport(
        () =>
          import(/* webpackChunkName: "FailedChecksPage" */ 'app/percona/check/components/ServiceChecks/ServiceChecks')
      ),
    },
    {
      path: '/pmm-database-checks/all-checks',
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
      path: '/inventory/agents',
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
      path: '/add-instance',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AddInstancePage" */ 'app/percona/add-instance/panel')
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
      path: '/environment-overview',
      component: SafeDynamicImport(
        () =>
          import(/* webpackChunkName: "EnvironmentOverview" */ 'app/percona/environment-overview/EnvironmentOverview')
      ),
    },
    ...getPluginCatalogRoutes(),
    ...getLiveRoutes(),
    ...getAlertingRoutes(),
    ...extraRoutes,
    {
      path: '/*',
      component: ErrorPage,
    },
    // TODO[Router]
    // ...playlistRoutes,
  ];
}
