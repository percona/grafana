/* eslint-disable react/display-name */
import React, { FC, useCallback } from 'react';
import { Button, Collapse, HorizontalGroup, useStyles2 } from '@grafana/ui';
import { LoaderButton } from '@percona/platform-core';
import { cx } from '@emotion/css';
import { withTypes } from 'react-final-form';
import { FilterSectionProps } from './FilterSection.types';
import { getStyles } from './FilterSection.styles';
import { FormApi } from 'final-form';

export const withFilterTypes = <T extends object>(
  emptyValues: T,
  initialValues?: Partial<T>
): FC<FilterSectionProps<T>> => ({
  children,
  onApply = () => null,
  isOpen,
  className = '',
  showApply = true,
  onSectionToogle = () => null,
  onClear = () => null,
}) => {
  const styles = useStyles2(getStyles);
  const { Form } = withTypes<T>();

  const onClearAll = useCallback(
    (form: FormApi<T, Partial<T>>) => {
      form.initialize(emptyValues);
      onClear();
    },
    [onClear]
  );

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onApply}
      render={({ form, handleSubmit, submitting, valid, pristine }) => (
        <Collapse collapsible isOpen={isOpen} onToggle={onSectionToogle} className={styles.collapse} label="Filters">
          <form onSubmit={handleSubmit} className={cx(styles.form, className)} role="form">
            {children}
            <HorizontalGroup justify="flex-end" spacing="md">
              {!!showApply && (
                <LoaderButton
                  data-testid="apply-filters-button"
                  size="md"
                  variant="primary"
                  disabled={!valid || pristine}
                  loading={submitting}
                >
                  Apply
                </LoaderButton>
              )}
              <Button
                type="button"
                data-testid="clear-filters-button"
                variant="secondary"
                onClick={() => onClearAll(form)}
              >
                Clear All
              </Button>
            </HorizontalGroup>
          </form>
        </Collapse>
      )}
    />
  );
};
