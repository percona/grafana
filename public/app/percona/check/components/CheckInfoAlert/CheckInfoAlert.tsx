import React from 'react';

import { locationService } from '@grafana/runtime/src/services/LocationService';
import { useStyles2 } from '@grafana/ui';
import { AlertLocalStorage } from 'app/percona/shared/components/Elements/AlertLocalStorage/AlertLocalStorage';
import { getPerconaSettings } from 'app/percona/shared/core/selectors';
import { useSelector } from 'app/types';

import { getStyles } from './CheckInfoAlert.styles';

export const ChecksInfoAlert = () => {
  const { result } = useSelector(getPerconaSettings);
  const { isConnectedToPortal } = result!;
  const styles = useStyles2(getStyles);
  console.log(isConnectedToPortal);
  return (
    <>
      {!isConnectedToPortal && (
        <AlertLocalStorage
          title="Want more free Advisors?"
          customButtonContent="Connect to Percona Platform"
          onCustomButtonClick={() => locationService.push(`/settings/percona-platform`)}
          uniqueName={'connectInfoAlert'}
        >
          <div className={styles.content}>
            Connect your PMM instance to Percona Platform and get instant access to our advanced Advisors. You can also
            connect your PMM instance to Percona Platform to get extra basic Advisors for free:{' '}
            <i>Generic Configuration, Resources Configuration, Configuration Security, Generic Performance</i> If youre
            looking for more advanced Advisors,{' '}
            <a
              data-testid="read-more-link"
              target="_blank"
              rel="noreferrer"
              href={'https://www.percona.com/software/percona-platform/subscription'}
              className={styles.link}
            >
              check out our Premium plans
            </a>{' '}
            instead.
          </div>
        </AlertLocalStorage>
      )}
    </>
  );
};
