import { PropsWithChildren } from 'react';

import { StoreState } from 'app/types/store';
import { OrgRole } from '@grafana/data';

export interface FeatureLoaderProps extends PropsWithChildren {
  featureName?: string;
  featureSelector?: (state: StoreState) => boolean;
  messagedataTestId?: string;
  allowedRoles?: OrgRole[];
}
