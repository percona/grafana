import React, { useState } from 'react';
import { ExtendedColumn } from '../..';

export const DropdownField = ({ column }: { column: ExtendedColumn<any> }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  return (
    <div>
      <select
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
        }}
      >
        <option value="">All</option>
        {column.options?.map((value, i) => (
          <option key={i} value={value.value as string}>
            {value.label}
          </option>
        ))}
      </select>
    </div>
  );
};
