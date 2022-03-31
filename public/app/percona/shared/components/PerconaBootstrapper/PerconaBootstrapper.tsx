import React, { useEffect } from 'react';
import { useAppDispatch } from 'app/store/store';
import {
  fetchSettingsAction,
  setAuthorized,
  fetchServerInfoAction,
  setIsPlatformUser,
} from 'app/percona/shared/core/reducers';
import { UserService } from '../../services/user/User.service';
import { logger } from '@percona/platform-core';

// This component is only responsible for populating the store with Percona's settings initially
export const PerconaBootstrapper = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getSettings = async () => {
      try {
        await dispatch(fetchSettingsAction()).unwrap();
        dispatch(setAuthorized(true));
      } catch (e) {
        if (e.response?.status === 401) {
          setAuthorized(false);
        }
      }
    };

    const getUserStatus = async () => {
      try {
        const isPlatformUser = await UserService.getUserStatus(undefined, true);
        dispatch(setIsPlatformUser(isPlatformUser));
      } catch (e) {
        logger.error(e);
      }
    };

    getSettings();
    getUserStatus();
    dispatch(fetchServerInfoAction());
  }, [dispatch]);

  return <></>;
};
