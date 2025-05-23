import { ReactNode } from 'react';

import { ResourcesWithUnits } from '../DBCluster.types';

export interface ResourcesBarProps {
  total: ResourcesWithUnits | undefined;
  allocated: ResourcesWithUnits | undefined;
  expected: ResourcesWithUnits | undefined;
  resourceLabel: string;
  resourceEmptyValueMessage?: string;
  icon?: ReactNode;
  dataTestId?: string;
  className?: string;
}
