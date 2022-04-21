/* eslint-disable react/display-name */
import React, { FC } from 'react';
import { CollapsableSection, HorizontalGroup } from '@grafana/ui';
import { LoaderButton } from '@percona/platform-core';
import { withTypes } from 'react-final-form';
import { FilterSectionProps } from './FilterSection.types';

export const withFilterTypes = <T extends object>(): FC<FilterSectionProps<T>> => ({ children, onApply }) => {
  const { Form } = withTypes<T>();
  return (
    <CollapsableSection isOpen label="filters">
      <Form
        onSubmit={onApply}
        render={({ form, handleSubmit, submitting, valid }) => (
          <form onSubmit={handleSubmit}>
            {children}
            <HorizontalGroup justify="center" spacing="md">
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
        )}
      />
    </CollapsableSection>
  );
};
