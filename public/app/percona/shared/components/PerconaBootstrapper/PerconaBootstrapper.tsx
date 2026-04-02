import { useEffect } from 'react';

import { config } from '@grafana/runtime';
import { fetchSettingsAction } from 'app/percona/shared/core/reducers';
import { fetchAdvisors } from 'app/percona/shared/core/reducers/advisors/advisors';
import { fetchUserDetailsAction, setAuthorized } from 'app/percona/shared/core/reducers/user/user';
import { getCategorizedAdvisors, getPerconaSettings, getUpdatesInfo } from 'app/percona/shared/core/selectors';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types/store';
import { buildInitialState, updateNavIndex } from 'app/core/reducers/navModel';
import {
  PMM_ACCESS_ROLE_CREATE_PAGE,
  PMM_ACCESS_ROLE_EDIT_PAGE,
  PMM_ACCESS_ROLES_PAGE,
  PMM_ADD_INSTANCE_PAGE,
  PMM_BACKUP_PAGE,
  PMM_DUMP_PAGE,
  PMM_EDIT_INSTANCE_PAGE,
  PMM_EXPORT_DUMP_PAGE,
  PMM_INVENTORY_PAGE,
} from './PerconaNavigation/PerconaNavigation.constants';
import {
  buildAdvisorsNavItem,
  buildIntegratedAlertingMenuItem,
  getPmmSettingsPage,
} from './PerconaNavigation/PerconaNavigation.utils';

import { Telemetry } from '../../../ui-events/components/Telemetry';
import { fetchHighAvailabilityStatus } from '../../core/reducers/highAvailability/highAvailability';
import { checkUpdatesAction } from '../../core/reducers/updates';
import { logger } from '../../helpers/logger';
import { isPmmAdmin, isViewer } from '../../helpers/permissions';
import { isPmmNavEnabled } from '../../helpers/plugin';

import { PerconaBootstrapperProps } from './PerconaBootstrapper.types';
import PerconaUpdateVersion from './PerconaUpdateVersion/PerconaUpdateVersion';
// This component is only responsible for populating the store with Percona's settings initially
export const PerconaBootstrapper = ({ onReady }: PerconaBootstrapperProps) => {
  const dispatch = useAppDispatch();
  const categorizedAdvisors = useSelector(getCategorizedAdvisors);
  const { result: settings } = useSelector(getPerconaSettings);
  const { updateAvailable, isLoading: isLoadingUpdates, showUpdateModal } = useSelector(getUpdatesInfo);
  const { user } = config.bootData;
  const { isSignedIn } = user;

  useEffect(() => {
    const updateNavTree = async () => {
      const updatedNavTree = buildInitialState();
      const { alertingEnabled } = settings || {};

      await dispatch(updateNavIndex(PMM_EXPORT_DUMP_PAGE));
      await dispatch(updateNavIndex(PMM_BACKUP_PAGE));
      await dispatch(updateNavIndex(PMM_INVENTORY_PAGE));
      await dispatch(updateNavIndex(PMM_ADD_INSTANCE_PAGE));
      await dispatch(updateNavIndex(PMM_EDIT_INSTANCE_PAGE));
      await dispatch(updateNavIndex(PMM_ACCESS_ROLE_CREATE_PAGE));
      await dispatch(updateNavIndex(PMM_ACCESS_ROLE_EDIT_PAGE));
      await dispatch(updateNavIndex(getPmmSettingsPage()));
      await dispatch(updateNavIndex(buildAdvisorsNavItem(categorizedAdvisors)));

      if (isPmmAdmin(config.bootData.user)) {
        // PMM Dump
        const help = updatedNavTree['help'];
        if (help) {
          dispatch(updateNavIndex(PMM_DUMP_PAGE));
          dispatch(updateNavIndex(help));
        }

        if (settings?.enableAccessControl) {
          const cfg = updatedNavTree['cfg'];

          // update nav index with the access roles tab
          if (cfg) {
            dispatch(updateNavIndex(PMM_ACCESS_ROLES_PAGE));
            dispatch(updateNavIndex(cfg));
          }
        }
      } else {
        dispatch(updateNavIndex(PMM_ACCESS_ROLES_PAGE));
      }

      if (alertingEnabled) {
        const integratedAlertingMenuItem = buildIntegratedAlertingMenuItem(updatedNavTree);
        if (integratedAlertingMenuItem) {
          dispatch(updateNavIndex(integratedAlertingMenuItem));
        }
      }
    };

    updateNavTree();
  }, [dispatch, settings, categorizedAdvisors]);

  useEffect(() => {
    const getSettings = async () => {
      try {
        const settings = await dispatch(fetchSettingsAction()).unwrap();
        dispatch(setAuthorized(isPmmAdmin(user)));
        return settings;
      } catch (e) {
        // @ts-ignore
        if (e.response?.status === 401) {
          setAuthorized(false);
        } else {
          logger.error(e);
        }
      }

      return null;
    };
    const bootstrap = async () => {
      const settings = await getSettings();

      if (!isViewer(user)) {
        await dispatch(fetchAdvisors({ disableNotifications: true }));
      }

      if (isPmmAdmin(user)) {
        if (settings?.updatesEnabled) {
          await dispatch(checkUpdatesAction());
        }
      }

      await dispatch(fetchUserDetailsAction());
      await dispatch(fetchHighAvailabilityStatus());
      onReady();
    };

    if (isSignedIn) {
      bootstrap();
    } else {
      onReady();
    }
  }, [dispatch, isSignedIn, onReady, user]);

  return (
    <>
      {isSignedIn && <Telemetry />}
      {!isPmmNavEnabled() && updateAvailable && showUpdateModal && !isLoadingUpdates && <PerconaUpdateVersion />}
    </>
  );
};
