import { ReactNode } from 'react';

export interface ResourcesBarProps {
  total: number;
  allocated: number;
  expected: number;
  resourceLabel: string;
  icon?: ReactNode;
  dataQa?: string;
}
