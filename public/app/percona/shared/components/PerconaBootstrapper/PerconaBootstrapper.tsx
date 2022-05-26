import React, { useEffect } from 'react';
import { useTour } from '@reactour/tour';
import { useAppDispatch } from 'app/store/store';
import {
  fetchSettingsAction,
  setAuthorized,
  fetchServerInfoAction,
  fetchServerSaasHostAction,
  fetchUserStatusAction,
} from 'app/percona/shared/core/reducers';
import { contextSrv } from 'app/core/services/context_srv';

// This component is only responsible for populating the store with Percona's settings initially
export const PerconaBootstrapper = () => {
  const dispatch = useAppDispatch();
  const { setCurrentStep, setIsOpen } = useTour();

  useEffect(() => {
    setCurrentStep(0);

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

    const bootstrap = async () => {
      await getSettings();
      await dispatch(fetchUserStatusAction());
      await dispatch(fetchServerInfoAction());
      await dispatch(fetchServerSaasHostAction());
      setTimeout(() => setIsOpen(true), 2000);
    };

    if (contextSrv.user.isSignedIn) {
      bootstrap();
    }
  }, [dispatch, setCurrentStep, setIsOpen]);

  return <></>;
};
