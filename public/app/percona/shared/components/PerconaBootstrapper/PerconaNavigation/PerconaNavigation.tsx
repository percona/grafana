import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';

import { initialState, updateNavTree } from 'app/core/reducers/navBarTree';
import { updateNavIndex } from 'app/core/reducers/navModel';
import { fetchFolders } from 'app/features/manage-dashboards/state/actions';
import { useAppDispatch } from 'app/store/store';
import { FolderDTO, useSelector } from 'app/types';

import { getPerconaSettings, getPerconaUser } from '../../../core/selectors';

import {
  getPmmSettingsPage,
  NAV_FOLDER_MAP,
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
  buildIntegratedAlertingMenuItem,
  buildInventoryAndSettings,
  removeAlertingMenuItem,
} from './PerconaNavigation.utils';

const PerconaNavigation: React.FC = () => {
  const [folders, setFolders] = useState<FolderDTO[]>([]);
  const { result } = useSelector(getPerconaSettings);
  const { alertingEnabled, sttEnabled, dbaasEnabled, backupEnabled } = result!;
  const { isPlatformUser, isAuthorized } = useSelector(getPerconaUser);
  const dispatch = useAppDispatch();

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
  }, []);

  // @PERCONA
  useEffect(() => {
    const updatedNavTree = cloneDeep(initialState);

    // @PERCONA
    if (isPlatformUser) {
      updatedNavTree.push(PMM_ENTITLEMENTS_PAGE);
      updatedNavTree.push(PMM_TICKETS_PAGE);
      updatedNavTree.push(PMM_ENVIRONMENT_OVERVIEW_PAGE);
    }

    // @PERCONA
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

    for (const rootNode of updatedNavTree) {
      const folder = folders.find((f) => rootNode.id && NAV_FOLDER_MAP[rootNode.id] === f.title);

      if (folder) {
        rootNode.children?.push({
          id: rootNode.id + '-other-dashboards',
          icon: 'search',
          text: 'Other dashboards',
          showIconInNavbar: true,
          url: `/graph/dashboards/f/${folder.uid}/${rootNode.id}`,
        });
      }
    }

    dispatch(updateNavTree({ items: updatedNavTree }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, folders, isAuthorized, isPlatformUser]);

  return null;
};

export default PerconaNavigation;
