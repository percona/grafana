import { SelectField } from 'app/percona/shared/components/Form/SelectField';
import React, { useState } from 'react';
import { Field } from 'react-final-form';
import { ExtendedColumn } from '../..';

export const DropdownField = ({ column }: { column: ExtendedColumn<any> }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  return (
    <div>
      <Field name="template">
        {({ input }) => (
          <SelectField
            options={column.options}
            {...input}
            onChange={(name) => {
              setSelectedValue(name.value);
              input.onChange(name);
            }}
            value={selectedValue}
            data-testid="template-select-input"
          />
        )}
      </Field>
    </div>
  );
};
