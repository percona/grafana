import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Spinner, useStyles } from '@grafana/ui';
import { getPerconaSettings, getPerconaUser } from 'app/percona/shared/core/selectors';
import { EmptyBlock } from '../EmptyBlock';
import { PermissionLoaderProps } from './PermissionLoader.types';
import { Messages } from './PermissionLoader.messages';
import { getStyles } from './PermissionLoader.styles';

export const PermissionLoader: FC<PermissionLoaderProps> = ({ featureSelector, renderSuccess, renderError }) => {
  const styles = useStyles(getStyles);
  const featureEnabled = useSelector(featureSelector);
  const { isAuthorized } = useSelector(getPerconaUser);
  const { loading } = useSelector(getPerconaSettings);

  if (loading) {
    return <Spinner />;
  }

  if (isAuthorized === false) {
    return <div data-testid="unauthorized">{Messages.unauthorized}</div>;
  }

  if (featureEnabled) {
    return <>{renderSuccess()}</>;
  }

  return (
    <div className={styles.emptyBlock}>
      <EmptyBlock dataTestId="empty-block">{renderError()}</EmptyBlock>
    </div>
  );
};
