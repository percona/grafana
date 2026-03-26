import { useEffect } from 'react';

import { config } from '@grafana/runtime';
import { fetchSettingsAction } from 'app/percona/shared/core/reducers';
import { fetchAdvisors } from 'app/percona/shared/core/reducers/advisors/advisors';
import { setAuthorized } from 'app/percona/shared/core/reducers/user/user';
import { getUpdatesInfo } from 'app/percona/shared/core/selectors';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

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
  const { updateAvailable, isLoading: isLoadingUpdates, showUpdateModal } = useSelector(getUpdatesInfo);
  const { user } = config.bootData;
  const { isSignedIn } = user;

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
