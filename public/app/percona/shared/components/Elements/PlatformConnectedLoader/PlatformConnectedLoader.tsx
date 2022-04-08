import React, { FC, useCallback } from 'react';
import { useStyles } from '@grafana/ui';
import { StoreState } from 'app/types';
import { Messages } from './PlatformConnectedLoader.messages';
import { PLATFORM_SETTINGS_URL } from './PlatformConnectedLoader.constants';
import { getStyles } from './PlatformConnectedLoader.styles';
import { PermissionLoader } from '../PermissionLoader';
import { useSelector } from 'react-redux';
import { getPerconaUser } from 'app/percona/shared/core/selectors';
import { EmptyBlock } from '../EmptyBlock';

export const PlatformConnectedLoader: FC = ({ children }) => {
  const styles = useStyles(getStyles);
  const featureSelector = useCallback((state: StoreState) => !!state.perconaSettings.isConnectedToPortal, []);
  const { isPlatformUser } = useSelector(getPerconaUser);

  const checkForPlatformUser = () => {
    if (isPlatformUser) {
      return children;
    }
    return <EmptyBlock dataTestId="not-platform-user">{Messages.platformUser}</EmptyBlock>;
  };

  const ErrorMessage = () => (
    <>
      {Messages.notConnected}&nbsp;
      <a data-testid="platform-link" className={styles.link} href={PLATFORM_SETTINGS_URL}>
        {Messages.portalSettings}
      </a>
    </>
  );

  return (
    <PermissionLoader
      featureSelector={featureSelector}
      renderSuccess={checkForPlatformUser}
      renderError={ErrorMessage}
    />
  );
};
