import React, { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';

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
  const history = useHistory();
  const methods = useForm({
    defaultValues: initialValues,
  });
  const errors = methods.formState.errors;
  const styles = useStyles2(getStyles);

  useEffect(() => {
    methods.reset(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleGoBack = () => {
    history.push('/roles');
  };

  return (
    <FormProvider {...methods}>
      <PageToolbar title={title} onGoBack={handleGoBack}>
        <ToolbarButton type="button" onClick={onCancel}>
          {cancelLabel}
        </ToolbarButton>
        <ToolbarButton type="submit" variant="primary" onClick={methods.handleSubmit(onSubmit)}>
          {submitLabel}
        </ToolbarButton>
      </PageToolbar>
      <Page.Contents isLoading={isLoading}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className={styles.page}>
            <Field label={Messages.name.label} invalid={!!errors.title} error={errors.title?.message}>
              <Input
                {...methods.register('title', { required: Messages.name.required })}
                type="text"
                placeholder={Messages.name.placeholder}
              />
            </Field>
            <Field label={Messages.description.label} description={Messages.description.description}>
              <Input {...methods.register('description')} type="text" placeholder={Messages.description.placeholder} />
            </Field>
            <Field
              label={Messages.metrics.label}
              invalid={!!errors.filter}
              error={errors.filter?.message}
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
              <LabelsField control={methods.control} />
            </Field>
          </div>
          <button type="submit" className={styles.none} />
        </form>
      </Page.Contents>
    </FormProvider>
  );
};

export default AddEditRoleForm;
