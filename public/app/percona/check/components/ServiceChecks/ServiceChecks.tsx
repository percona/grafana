import React, { FC } from 'react';
import { GrafanaRouteComponentProps } from 'app/core/navigation/types';
import { PAGE_MODEL } from '../../CheckPanel.constants';
import PageWrapper from 'app/percona/shared/components/PageWrapper/PageWrapper';

export const ServiceChecks: FC<GrafanaRouteComponentProps<{ service: string }>> = ({ match }) => {
  return (
    <PageWrapper pageModel={PAGE_MODEL} dataTestId="db-service-checks">
      <div>{match.params.service}</div>
    </PageWrapper>
  );
};

export default ServiceChecks;
