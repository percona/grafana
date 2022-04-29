import { useStyles2 } from '@grafana/ui';
import React from 'react';
import { PlatformConnectedLoader } from '../shared/components/Elements/PlatformConnectedLoader';
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';
import { Contact } from './components/ContactWidget/Contact';
import { PAGE_MODEL } from './EnvironmentOverview.constants';
import { getStyles } from './EnvironmentOverview.styles';

export const EnvironmentOverview = () => {
  const styles = useStyles2(getStyles);

  return (
    <PageWrapper pageModel={PAGE_MODEL} dataTestId="environment-overview">
      <PlatformConnectedLoader>
        <div className={styles.widgetsWrapper}>
          <Contact />
        </div>
      </PlatformConnectedLoader>
    </PageWrapper>
  );
};

export default EnvironmentOverview;
