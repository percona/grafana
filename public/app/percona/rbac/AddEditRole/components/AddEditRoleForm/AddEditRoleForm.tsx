import React, { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Field, Input, PageToolbar, ToolbarButton, useStyles2 } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';

import LabelsField from '../LabelsField';

import { Messages } from './AddEditRoleForm.messages';
import { getStyles } from './AddEditRoleForm.styles';
import { AddEditRoleFormProps } from './AddEditRoleForm.types';

const AddEditRoleForm: FC<AddEditRoleFormProps> = ({
  initialValues,
  isLoading,
  title,
  cancelLabel,
  onCancel,
  submitLabel,
  onSubmit,
}) => {
  const methods = useForm({
    defaultValues: initialValues,
  });
  const styles = useStyles2(getStyles);

  useEffect(() => {
    methods.reset(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <PageToolbar title={title}>
          <ToolbarButton type="button" onClick={onCancel}>
            {cancelLabel}
          </ToolbarButton>
          <ToolbarButton type="submit" variant="primary">
            {submitLabel}
          </ToolbarButton>
        </PageToolbar>
        <Page.Contents isLoading={isLoading}>
          <div className={styles.page}>
            <Field label={Messages.name.label}>
              <Input {...methods.register('title')} type="text" placeholder={Messages.name.placeholder} />
            </Field>
            <Field label={Messages.description.label} description={Messages.description.description}>
              <Input {...methods.register('description')} type="text" placeholder={Messages.description.placeholder} />
            </Field>
            <Field
              label={Messages.metrics.label}
              description={
                <>
                  {Messages.metrics.description}
                  <Link className={styles.link} to="/inventory/services">
                    {Messages.metrics.link}
                  </Link>
                  .
                </>
              }
            >
              <LabelsField register={methods.register} placeholder={Messages.metrics.placeholder} />
            </Field>
          </div>
        </Page.Contents>
      </form>
    </FormProvider>
  );
};

export default AddEditRoleForm;
