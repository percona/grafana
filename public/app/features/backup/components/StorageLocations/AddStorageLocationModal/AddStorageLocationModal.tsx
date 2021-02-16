import React, { FC } from 'react';
import { SelectableValue } from '@grafana/data';
import { withTypes } from 'react-final-form';
import {
  Modal,
  TextInputField,
  TextareaInputField,
  RadioButtonGroupField,
  validators,
  LoaderButton,
} from '@percona/platform-core';
import { Messages } from './AddStorageLocationModal.messages';
import {
  AddStorageLocationFormProps,
  AddStorageLocationModalProps,
  FormStorageType,
} from './AddStorageLocationModal.types';
import { S3Fields } from './S3Fields';
import { LocalFields } from './LocalFields';
import { toFormStorageLocation, toStorageLocation } from './AddStorageLocation.utils';
import { Button, HorizontalGroup } from '@grafana/ui';

const TypeField: FC<{ values: AddStorageLocationFormProps }> = ({ values }) => {
  const { type, client, server, endpoint, accessKey, secretKey } = values;

  switch (type) {
    case FormStorageType.S3:
      return <S3Fields endpoint={endpoint} accessKey={accessKey} secretKey={secretKey} />;
    case FormStorageType.SERVER:
      return <LocalFields name="server" path={server} />;
    case FormStorageType.CLIENT:
      return <LocalFields name="client" path={client} />;
    default:
      return null;
  }
};

const typeOptions: Array<SelectableValue<FormStorageType>> = [
  {
    value: FormStorageType.S3,
    label: 'S3',
  },
  {
    value: FormStorageType.CLIENT,
    label: 'Local Client',
  },
  {
    value: FormStorageType.SERVER,
    label: 'Local Server',
  },
];

const { Form } = withTypes<AddStorageLocationFormProps>();

export const AddStorageLocationModal: FC<AddStorageLocationModalProps> = ({ isVisible, location, onClose, onAdd }) => {
  const initialValues = toFormStorageLocation(location);

  const onSubmit = (values: AddStorageLocationFormProps) => onAdd(toStorageLocation(values));

  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={onClose}>
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ handleSubmit, valid, pristine, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <TextInputField name="name" label={Messages.name} validators={[validators.required]} />
            <TextareaInputField name="description" validators={[validators.required]} />
            <RadioButtonGroupField options={typeOptions} name="type" fullWidth />
            <TypeField values={values} />
            <HorizontalGroup justify="center" spacing="md">
              <LoaderButton
                data-qa="storage-location-add-button"
                size="md"
                variant="primary"
                disabled={!valid || pristine}
                loading={submitting}
              >
                {location ? Messages.addAction : Messages.editAction}
              </LoaderButton>
              <Button data-qa="storage-location-cancel-button" variant="secondary" onClick={onClose}>
                {Messages.cancelAction}
              </Button>
            </HorizontalGroup>
          </form>
        )}
      />
    </Modal>
  );
};

AddStorageLocationModal.defaultProps = {
  onClose: () => null,
  onAdd: () => null,
};
