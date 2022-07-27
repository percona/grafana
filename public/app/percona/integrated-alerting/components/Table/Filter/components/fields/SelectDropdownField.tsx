import { SelectField } from 'app/percona/shared/components/Form/SelectField';
import React from 'react';
import { Field } from 'react-final-form';
import { ExtendedColumn } from '../../..';
import { ALL_LABEL, ALL_VALUE } from '../../Filter.constants';
import { buildColumnOptions } from '../../Filter.utils';

export const SelectDropdownField = ({ column }: { column: ExtendedColumn }) => {
  const columnOptions = buildColumnOptions(column);
  return (
    <div>
      <Field name={`${column.accessor}`}>
        {({ input }) => (
          <SelectField
            options={columnOptions}
            defaultValue={{ value: ALL_VALUE, label: ALL_LABEL }}
            label={column.label ?? column.Header}
            {...input}
            data-testid="select-dropdown"
          />
        )}
      </Field>
    </div>
  );
};
