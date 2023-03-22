import React from 'react';

import { BaseCheckbox } from '../../../../shared/core-ui/components/Checkbox';

import { TableCheckboxProps } from './TableCheckbox.types';

export const TableCheckbox: React.FC<TableCheckboxProps> = ({ id, checked, onChange, title }) => (
  <BaseCheckbox
    name={`table-select-${id}`}
    title={title}
    value={String(checked)}
    checked={checked}
    onChange={onChange}
  />
);

TableCheckbox.displayName = 'TableCheckbox';
