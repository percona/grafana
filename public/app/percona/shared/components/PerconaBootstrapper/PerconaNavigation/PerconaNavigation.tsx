import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';

import { initialState, updateNavTree } from 'app/core/reducers/navBarTree';
import { updateNavIndex } from 'app/core/reducers/navModel';
import { fetchFolders } from 'app/features/manage-dashboards/state/actions';
import { fetchServicesAction } from 'app/percona/shared/core/reducers/services/services';
import { useAppDispatch } from 'app/store/store';
import { FolderDTO, useSelector } from 'app/types';

import { getPerconaSettings, getPerconaUser, getServices } from '../../../core/selectors';

import {
  getPmmSettingsPage,
  PMM_ADD_INSTANCE_PAGE,
  PMM_BACKUP_PAGE,
  PMM_DBAAS_PAGE,
  PMM_ENTITLEMENTS_PAGE,
  PMM_ENVIRONMENT_OVERVIEW_PAGE,
  PMM_INVENTORY_PAGE,
  PMM_STT_PAGE,
  PMM_TICKETS_PAGE,
} from './PerconaNavigation.constants';
import {
  addFolderLinks,
  buildIntegratedAlertingMenuItem,
  buildInventoryAndSettings,
  filterByServices,
  removeAlertingMenuItem,
} from './PerconaNavigation.utils';

const PerconaNavigation: React.FC = () => {
  const [folders, setFolders] = useState<FolderDTO[]>([]);
  const { result } = useSelector(getPerconaSettings);
  const { alertingEnabled, sttEnabled, dbaasEnabled, backupEnabled } = result!;
  const { isPlatformUser, isAuthorized } = useSelector(getPerconaUser);
  const dispatch = useAppDispatch();
  const { services } = useSelector(getServices);

  dispatch(updateNavIndex(getPmmSettingsPage(alertingEnabled)));
  dispatch(updateNavIndex(PMM_STT_PAGE));
  dispatch(updateNavIndex(PMM_DBAAS_PAGE));
  dispatch(updateNavIndex(PMM_BACKUP_PAGE));
  dispatch(updateNavIndex(PMM_INVENTORY_PAGE));
  dispatch(updateNavIndex(PMM_ADD_INSTANCE_PAGE));
  dispatch(updateNavIndex(PMM_TICKETS_PAGE));
  dispatch(updateNavIndex(PMM_ENTITLEMENTS_PAGE));
  dispatch(updateNavIndex(PMM_ENVIRONMENT_OVERVIEW_PAGE));

  useEffect(() => {
    fetchFolders().then(setFolders);
    dispatch(fetchServicesAction({}));
  }, [dispatch]);

  useEffect(() => {
    const updatedNavTree = cloneDeep(initialState);

    if (isPlatformUser) {
      updatedNavTree.push(PMM_ENTITLEMENTS_PAGE);
      updatedNavTree.push(PMM_TICKETS_PAGE);
      updatedNavTree.push(PMM_ENVIRONMENT_OVERVIEW_PAGE);
    }

    if (isAuthorized) {
      buildInventoryAndSettings(updatedNavTree);

      const iaMenuItem = alertingEnabled
        ? buildIntegratedAlertingMenuItem(updatedNavTree)
        : removeAlertingMenuItem(updatedNavTree);

      if (iaMenuItem) {
        dispatch(updateNavIndex(iaMenuItem));
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

    addFolderLinks(updatedNavTree, folders);

    dispatch(updateNavTree({ items: filterByServices(updatedNavTree, services) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, folders, services, isAuthorized, isPlatformUser]);

  return null;
};

export default PerconaNavigation;