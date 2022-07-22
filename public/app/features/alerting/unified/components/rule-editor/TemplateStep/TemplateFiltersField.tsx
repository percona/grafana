import React, { FC, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { SelectableValue } from '@grafana/data';
import { Button, Field, FieldArray, Input, useStyles2, Select, Label } from '@grafana/ui';
import { AlertRuleFilterType } from 'app/percona/shared/services/AlertRules/AlertRules.types';

import { Messages } from './TemplateStep.messages';
import { getStyles } from './TemplateStep.styles';

const TemplateFiltersField: FC = () => {
  const styles = useStyles2(getStyles);
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
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
                <Field error={errors.filters?.[index]?.key?.message} invalid={!!errors.filters?.[index]?.key?.message}>
                  <Input
                    {...register(`filters[${index}].key`, {
                      required: { value: true, message: Messages.errors.filterKey },
                    })}
                    placeholder={Messages.filter.fieldKey}
                  />
                </Field>
              </div>

              <div className={styles.filterFields}>
                <Field
                  error={errors.filters?.[index]?.operators?.message}
                  invalid={!!errors.filters?.[index]?.operators?.message}
                >
                  <Controller
                    name={`filters[${index}].operators`}
                    rules={{ required: { value: true, message: Messages.errors.operatorRequired } }}
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
                <Field
                  error={errors.filters?.[index]?.value?.message}
                  invalid={!!errors.filters?.[index]?.value?.message}
                >
                  <Input
                    {...register(`filters[${index}].value`, {
                      required: { value: true, message: Messages.errors.filterValue },
                    })}
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
