import React, { FC } from 'react';
import { Messages } from './PlatformConnectedLoader.messages';
import { useSelector } from 'react-redux';
import { getPerconaSettings, getPerconaUser } from 'app/percona/shared/core/selectors';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';

export const PlatformConnectedLoader: FC = ({ children }) => {
  const { isConnectedToPortal } = useSelector(getPerconaSettings);
  const { isPlatformUser } = useSelector(getPerconaUser);

  if (isPlatformUser) {
    return <>{children}</>;
  } else {
    if (isConnectedToPortal) {
      return <ErrorMessage dataTestId="not-platform-user" message={Messages.platformUser} />;
    }
    if (!isConnectedToPortal) {
      return <ErrorMessage dataTestId="not-connected-platform" message={Messages.notConnected} />;
    }
  }

  return <ErrorMessage dataTestId="unauthorized" message={Messages.unauthorized} />;
};
