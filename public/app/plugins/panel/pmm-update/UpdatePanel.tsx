import { FC, MouseEvent, useState } from 'react';

import { locationService } from '@grafana/runtime';
import { Button, Icon, Spinner, Stack, Tooltip, useStyles2 } from '@grafana/ui';
import { PMM_UPDATES_LINK } from 'app/percona/shared/components/PerconaBootstrapper/PerconaNavigation';
import { checkUpdatesAction } from 'app/percona/shared/core/reducers/updates';
import { getPerconaUser, getPerconaSettings, getUpdatesInfo } from 'app/percona/shared/core/selectors';
import { isPmmNavEnabled } from 'app/percona/shared/helpers/plugin';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

import { Messages } from './UpdatePanel.messages';
import { getDeprecationTooltipStyles, styles } from './UpdatePanel.styles';
import { formatDateWithTime } from './UpdatePanel.utils';
import { AvailableUpdate, CurrentVersion, InfoBox, LastCheck } from './components';

const DEPRECATION_DOCKER_UPGRADE_HREF =
  'https://docs.percona.com/percona-monitoring-and-management/3/pmm-upgrade/upgrade_docker.html';

const DEPRECATION_PODMAN_UPGRADE_HREF =
  'https://docs.percona.com/percona-monitoring-and-management/3/pmm-upgrade/upgrade_podman.html';
const DEPRECATION_HELM_UPGRADE_HREF =
  'https://docs.percona.com/percona-monitoring-and-management/3/pmm-upgrade/upgrade_helm.html';

const DeprecationTooltipContent: FC = () => {
  const tooltipStyles = useStyles2(getDeprecationTooltipStyles);

  return (
    <>
      <strong>UI upgrades deprecated</strong>: This upgrade panel will be removed in PMM 3.9.0.
      <br />
      Use&nbsp;
      <a
        className={tooltipStyles.link}
        href={DEPRECATION_DOCKER_UPGRADE_HREF}
        target="_blank"
        rel="noreferrer"
      >Docker</a> (recommended), <a
        className={tooltipStyles.link}
        href={DEPRECATION_PODMAN_UPGRADE_HREF}
        target="_blank"
        rel="noreferrer"
      >Podman</a>, or <a
        className={tooltipStyles.link}
        href={DEPRECATION_HELM_UPGRADE_HREF}
        target="_blank"
        rel="noreferrer"
      >Helm</a> for future PMM upgrades.
    </>
  );
};

export const UpdatePanel: FC = () => {
  const isOnline = navigator.onLine;
  const {
    isLoading: isLoadingVersionDetails,
    installed,
    latest,
    latestNewsUrl,
    updateAvailable,
    lastChecked,
  } = useSelector(getUpdatesInfo);
  const { result: settings, loading: isLoadingSettings } = useSelector(getPerconaSettings);
  const dispatch = useAppDispatch();
  const [forceUpdate, setForceUpdate] = useState(false);
  const { isAuthorized } = useSelector(getPerconaUser);
  const isDefaultView = !latest;
  const isLoading = isLoadingVersionDetails || isLoadingSettings;

  const handleCheckForUpdates = (e: MouseEvent) => {
    if (e.altKey) {
      setForceUpdate(true);
    }

    dispatch(checkUpdatesAction());
  };

  const handleOpenUpdates = () => {
    if (isPmmNavEnabled()) {
      locationService.push(PMM_UPDATES_LINK.url!);
    } else {
      window.location.assign(PMM_UPDATES_LINK.url!);
    }
  };

  return (
    <>
      <div className={styles.panel}>
        {!!installed && <CurrentVersion currentVersion={installed} />}
        {updateAvailable && !isDefaultView && settings?.updatesEnabled && isAuthorized && !isLoading && isOnline ? (
          <AvailableUpdate nextVersion={latest} newsLink={latestNewsUrl} />
        ) : null}
        {isLoading ? (
          <div className={styles.middleSectionWrapper}>
            <Spinner />
          </div>
        ) : (
          <>
            {(updateAvailable || forceUpdate) && settings?.updatesEnabled && isAuthorized && isOnline ? (
              <div className={styles.middleSectionWrapper}>
                <Tooltip interactive content={<DeprecationTooltipContent />}>
                  <Button onClick={handleOpenUpdates} variant="secondary">
                    <Stack direction="row" gap={0.5} alignItems="center">
                      <Icon name="exclamation-triangle" />
                      <span>{!!latest?.version ? Messages.upgradeTo(latest.version) : Messages.upgrade}</span>
                    </Stack>
                  </Button>
                </Tooltip>
              </div>
            ) : (
              <InfoBox
                upToDate={!isDefaultView && !forceUpdate}
                hasNoAccess={!isAuthorized}
                updatesDisabled={!settings?.updatesEnabled}
                isOnline={isOnline}
              />
            )}
          </>
        )}
        <LastCheck
          disabled={isLoading || !settings?.updatesEnabled || !isOnline}
          onCheckForUpdates={handleCheckForUpdates}
          lastCheckDate={lastChecked ? formatDateWithTime(lastChecked) : ''}
        />
      </div>
    </>
  );
};
