import React, { FC, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { SelectableValue } from '@grafana/data';
import { Button, Field, FieldArray, Input, useStyles2, Select } from '@grafana/ui';
import { AlertRuleFilterType } from 'app/percona/integrated-alerting/components/AlertRules/AlertRules.types';
import { LinkTooltip } from 'app/percona/shared/components/Elements/LinkTooltip/LinkTooltip';
import { Label } from 'app/percona/shared/components/Form/Label/Label';

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
            <Label label={Messages.filter.header} dataTestId="filters-field-label" />
            <LinkTooltip tooltipText={Messages.tooltips.filters} icon="info-circle" />
          </div>

          <Button
            className={styles.filterButton}
            variant="secondary"
            type="button"
            onClick={append}
            data-testid="add-filter-button"
          >
            {Messages.filter.addButton}
          </Button>
          {fields.map((name, index) => (
            <div key={name.id} className={styles.filterRowWrapper} data-testid="filter-fields-row">
              <div className={styles.filterFields}>
                <Field>
                  <Input
                    {...register(`labels[${name}].key`, { required: true })}
                    placeholder={Messages.filter.fieldLabel}
                  />
                </Field>
              </div>

              <div className={styles.filterFields}>
                <Field>
                  <Controller
                    name={`labels[${name}].operators`}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        onChange={onChange}
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
                    {...register(`labels[${name}].value`, { required: true })}
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
