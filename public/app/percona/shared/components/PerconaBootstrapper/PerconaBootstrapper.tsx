import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPortalConnected, setFeatures, setAuthorized } from 'app/percona/shared/core/reducers';
import { SettingsService } from 'app/percona/settings/Settings.service';
import { FeatureFlags, FeatureFlagsStaticProps } from 'app/percona/shared/core/types';

export const PerconaBootstrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getSettings = async () => {
      try {
        const settings = await SettingsService.getSettings(undefined, true);
        const flags: Partial<FeatureFlags> = {};

        Object.keys(settings).forEach((setting) => {
          const typedSetting = setting as keyof FeatureFlags;
          if (FeatureFlagsStaticProps.includes(typedSetting) && !!settings[typedSetting]) {
            flags[typedSetting] = true;
          }
        });

        if (Object.keys(flags).length > 0) {
          dispatch(setFeatures(flags));
        }

        dispatch(setAuthorized(true));
        dispatch(setPortalConnected(!!settings.isConnectedToPortal));
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
