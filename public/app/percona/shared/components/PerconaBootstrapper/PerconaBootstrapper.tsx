import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSettings, setAuthorized } from 'app/percona/shared/core/reducers';
import { SettingsService } from 'app/percona/settings/Settings.service';

export const PerconaBootstrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getSettings = async () => {
      try {
        const settings = await SettingsService.getSettings(undefined, true);
        dispatch(setSettings(settings));

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
