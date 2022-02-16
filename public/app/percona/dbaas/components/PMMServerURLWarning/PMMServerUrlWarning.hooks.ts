import { useState, useEffect, useMemo } from 'react';
import { SettingsService } from '../../../settings/Settings.service';
import { Settings } from '../../../settings/Settings.types';
import { logger } from '@percona/platform-core';

export const usePMMServerWarning = (): boolean => {
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>();

  const showMonitoringWarning = useMemo(() => settingsLoading || !settings?.publicAddress, [settings, settingsLoading]);

  useEffect(() => {
    const getSettings = async () => {
      try {
        setSettingsLoading(true);
        const settings = await SettingsService.getSettings();
        setSettings(settings);
      } catch (e) {
        logger.error(e);
      } finally {
        setSettingsLoading(false);
      }
    };

    getSettings();
  }, []);

  return showMonitoringWarning;
};
