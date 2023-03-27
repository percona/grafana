import { logger } from '@percona/platform-core';
import React, { useEffect, useState, FC, MouseEvent } from 'react';

import { Spinner } from '@grafana/ui';
import { SettingsService } from 'app/percona/settings/Settings.service';

import { styles } from './UpdatePanel.styles';
import { AvailableUpdate, CurrentVersion, InfoBox, LastCheck, ProgressModal, UpgradeButton } from './components';
import { useVersionDetails, usePerformUpdate } from './hooks';
import { UpdateMethod } from './types';

export const UpdatePanel: FC<{}> = () => {
  const isOnline = navigator.onLine;
  const [forceUpdate, setForceUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [updatesDisabled, setUpdatesDisabled] = useState(false);
  const [isLoadingSettings, setLoadingSettings] = useState(true);
  const [hasNoAccess, setHasNoAccess] = useState(false);
  const [
    { installedVersionDetails, lastCheckDate, nextVersionDetails, isUpdateAvailable, isUpgradeServiceAvailable },
    fetchVersionErrorMessage,
    isLoadingVersionDetails,
    isDefaultView,
    getCurrentVersionDetails,
  ] = useVersionDetails();
  const [output, updateErrorMessage, isUpdated, updateFailed, launchUpdate] = usePerformUpdate();
  const isLoading = isLoadingVersionDetails || isLoadingSettings;

  const getSettings = async () => {
    setLoadingSettings(true);

    try {
      const { updatesDisabled } = await SettingsService.getSettings(undefined, true);

      setUpdatesDisabled(!!updatesDisabled);
    } catch (e) {
      // @ts-ignore
      if (e.response?.status === 401) {
        setHasNoAccess(true);
      }

      logger.error(e);
    }

    setLoadingSettings(false);
  };

  const handleCheckForUpdates = (e: MouseEvent) => {
    if (e.altKey) {
      setForceUpdate(true);
    }

    getCurrentVersionDetails({ force: true });
  };

  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    setErrorMessage(fetchVersionErrorMessage || updateErrorMessage);

    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [fetchVersionErrorMessage, updateErrorMessage]);

  const handleUpdate = () => {
    setShowModal(true);
    launchUpdate(isUpgradeServiceAvailable ? UpdateMethod.server : UpdateMethod.legacy);
  };

  return (
    <>
      <div className={styles.panel}>
        <CurrentVersion installedVersionDetails={installedVersionDetails} />
        {isUpdateAvailable && !isDefaultView && !updatesDisabled && !hasNoAccess && !isLoading && isOnline ? (
          <AvailableUpdate nextVersionDetails={nextVersionDetails} />
        ) : null}
        {isLoading ? (
          <div className={styles.middleSectionWrapper}>
            <Spinner />
          </div>
        ) : (
          <>
            {(isUpdateAvailable || forceUpdate) && !updatesDisabled && !hasNoAccess && isOnline ? (
              <div className={styles.middleSectionWrapper}>
                <UpgradeButton
                  onClick={handleUpdate}
                  upgradeServiceAvailable={isUpgradeServiceAvailable}
                  nextVersion={nextVersionDetails?.nextVersion}
                />
              </div>
            ) : (
              <InfoBox
                upToDate={!isDefaultView && !forceUpdate}
                hasNoAccess={hasNoAccess}
                updatesDisabled={updatesDisabled}
                isOnline={isOnline}
              />
            )}
          </>
        )}
        <LastCheck
          disabled={isLoading || updatesDisabled || !isOnline}
          onCheckForUpdates={handleCheckForUpdates}
          lastCheckDate={lastCheckDate}
        />
      </div>
      <ProgressModal
        errorMessage={errorMessage}
        isOpen={showModal}
        isUpdated={isUpdated}
        output={output}
        updateFailed={updateFailed}
        version={nextVersionDetails?.nextVersion}
      />
    </>
  );
};
