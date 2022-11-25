/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PageSwitcherProps {
  values: Array<PageSwitcherValue<any>>;
  className?: string;
}

export interface PageSwitcherValue<T> {
  id: number;
  name: string;
  value: T;
  selected: boolean;
  onClick?: () => void;
  label: string;
  description: string;
}

export interface SelectedState {
  id: number;
  selected: boolean;
}
