import { ReactNode } from 'react';
export interface Action {
  title: ReactNode;
  action: () => void;
  disabled?: boolean;
}

export interface MultipleActionsProps {
  actions: Action[];
  disabled?: boolean;
  dataTestId?: string;
}
