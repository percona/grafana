import React from 'react';

import { BaseCheckbox } from 'app/percona/shared/components/Elements/Checkbox';

import { TableCheckboxProps } from './TableCheckbox.types';

export const TableCheckbox: React.FC<TableCheckboxProps> = ({ id, checked, onChange, title }) => (
  <BaseCheckbox
    // @ts-ignore
    name={`table-select-${id}`}
    title={title}
    value={String(checked)}
    checked={checked}
    onChange={onChange}
  />
);

TableCheckbox.displayName = 'TableCheckbox';
