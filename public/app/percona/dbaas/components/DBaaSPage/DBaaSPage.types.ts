import { Props } from '@grafana/ui/src/components/PageLayout/PageToolbar';
import { LoaderButtonProps } from 'app/percona/shared/core-ui';

import { FeatureLoaderProps } from '../../../shared/components/Elements/FeatureLoader/FeatureLoader.types';

export interface DBaaSPageProps {
  pageToolbarProps: Props;
  submitBtnProps: LoaderButtonProps & { buttonMessage?: string };
  pageHeader: string;
  pageName: string;
  cancelUrl: string;
  children: React.ReactNode;
  featureLoaderProps: FeatureLoaderProps;
}
