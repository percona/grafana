import React, { useEffect } from 'react';
import { useAppDispatch } from 'app/store/store';
import { fetchSettingsAction, setAuthorized } from 'app/percona/shared/core/reducers';

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

    getSettings();
  }, [dispatch]);

  return <></>;
};
