import React, { FC, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { SelectableValue } from '@grafana/data';
import { Button, Field, FieldArray, Input, useStyles2, Select, Label } from '@grafana/ui';
import { AlertRuleFilterType } from 'app/percona/integrated-alerting/components/AlertRules/AlertRules.types';

import { Messages } from './TemplateStep.messages';
import { getStyles } from './TemplateStep.styles';

const TemplateFiltersField: FC = () => {
  const styles = useStyles2(getStyles);
  const { register, control } = useFormContext();
  const filterOptions: Array<SelectableValue<AlertRuleFilterType>> = useMemo(
    () =>
      Object.entries(AlertRuleFilterType).map(([key, value]) => ({
        label: `${value} (${key})`,
        value: value,
      })),
    []
  );

  return (
    <FieldArray name="filters" control={control}>
      {({ fields, append, remove }) => (
        <>
          <div className={styles.filtersLabelWrapper}>
            <Label description={Messages.tooltips.filters}>{Messages.filter.header}</Label>
          </div>

          <Button
            className={styles.filterButton}
            variant="secondary"
            type="button"
            onClick={() => append({})}
            data-testid="add-filter-button"
          >
            {Messages.filter.addButton}
          </Button>
          {fields.map((name, index) => (
            <div key={name.id} className={styles.filterRowWrapper} data-testid="filter-fields-row">
              <div className={styles.filterFields}>
                <Field>
                  <Input
                    {...register(`filters[${index}].key`, { required: true })}
                    placeholder={Messages.filter.fieldLabel}
                  />
                </Field>
              </div>

              <div className={styles.filterFields}>
                <Field>
                  <Controller
                    name={`filters[${index}].operators`}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        onChange={(e) => onChange(e.value)}
                        value={value}
                        options={filterOptions}
                        placeholder={Messages.filter.fieldOperators}
                      />
                    )}
                  />
                </Field>
              </div>
              <div className={styles.filterFields}>
                <Field>
                  <Input
                    {...register(`filters[${index}].value`, { required: true })}
                    placeholder={Messages.filter.fieldValue}
                  />
                </Field>
              </div>
              <Button
                aria-label="delete label"
                icon="trash-alt"
                variant="secondary"
                onClick={() => {
                  remove(index);
                }}
              />
            </div>
          ))}
        </>
      )}
    </FieldArray>
  );
};

export default TemplateFiltersField;
