/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions, no-console */

import React from 'react';

import { AvailableIcons } from '../Icon/types';

export interface Action {
  callback: () => void;
  icon: AvailableIcons;
  label: string;
  isBulkAction?: boolean;
}

export interface TableToolbarProps {
  actions: Action[];
  selectedItems: any[];
}

export interface TableToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: AvailableIcons;
  label: string;
  enabled?: boolean;
}
