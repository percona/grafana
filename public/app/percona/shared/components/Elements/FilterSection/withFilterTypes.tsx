/* eslint-disable react/display-name */
import React, { FC, useState, useCallback } from 'react';
import { Collapse, HorizontalGroup, useStyles2 } from '@grafana/ui';
import { LoaderButton } from '@percona/platform-core';
import { cx } from '@emotion/css';
import { withTypes } from 'react-final-form';
import { FilterSectionProps } from './FilterSection.types';
import { getStyles } from './FilterSection.styles';

export const withFilterTypes = <T extends object>(): FC<FilterSectionProps<T>> => ({
  children,
  onApply,
  className = '',
}) => {
  const styles = useStyles2(getStyles);
  const [sectionIsOpen, setSectionIsOpen] = useState(false);
  const { Form } = withTypes<T>();

  const changeIsOpen = useCallback(() => setSectionIsOpen((open) => !open), []);

  return (
    <Form
      onSubmit={onApply}
      render={({ form, handleSubmit, submitting, valid }) => (
        <Collapse
          collapsible
          isOpen={sectionIsOpen}
          onToggle={changeIsOpen}
          className={styles.collapse}
          label="Filters"
        >
          <form onSubmit={handleSubmit} className={cx(styles.form, className)}>
            {children}
            <HorizontalGroup justify="flex-end" spacing="md">
              <LoaderButton
                data-testid="backup-add-button"
                size="md"
                variant="primary"
                disabled={!valid}
                loading={submitting}
              >
                Apply
              </LoaderButton>
            </HorizontalGroup>
          </form>
        </Collapse>
      )}
    />
  );
};
