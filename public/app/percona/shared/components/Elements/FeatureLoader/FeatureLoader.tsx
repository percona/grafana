import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from '@grafana/ui';
import { StoreState } from 'app/types';
import { EmptyBlock } from '../EmptyBlock';
import { FeatureLoaderProps } from './FeatureLoader.types';
import { Messages } from './FeatureLoader.messages';
import { PMM_SETTINGS_URL } from './FeatureLoader.constants';
import { getStyles } from './FeatureLoader.styles';

export const FeatureLoader: FC<FeatureLoaderProps> = ({
  featureName,
  featureSelector,
  messagedataTestId = 'settings-link',
  children,
}) => {
  const styles = useStyles(getStyles);
  const featureEnabled = useSelector(featureSelector);
  const hasAccess = useSelector((state: StoreState) => state.perconaUser.isAuthorized);

  if (featureEnabled) {
    return <>{children}</>;
  }

  return (
    <div className={styles.emptyBlock}>
      <EmptyBlock dataTestId="empty-block">
        {hasAccess ? (
          <>
            {Messages.featureDisabled(featureName)}&nbsp;
            <a data-testid={messagedataTestId} className={styles.link} href={PMM_SETTINGS_URL}>
              {Messages.pmmSettings}
            </a>
          </>
        ) : (
          <>
            <div data-testid="unauthorized">{Messages.unauthorized}</div>
          </>
        )}
      </EmptyBlock>
    </div>
  );
};
