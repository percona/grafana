import React, { FC } from 'react';
import { SelectableValue } from '@grafana/data';
import { withTypes } from 'react-final-form';
import { Modal, TextInputField, TextareaInputField, RadioButtonGroupField, validators } from '@percona/platform-core';
import { Messages } from './AddStorageLocationModal.messages';
import {
  AddStorageLocationFormProps,
  AddStorageLocationModalProps,
  FormStorageType,
} from './AddStorageLocationModal.types';
import { S3Fields } from './S3Fields';
import { toFormStorageLocation } from './AddStorageLocation.utils';

const TypeField: FC<{ values: AddStorageLocationFormProps }> = ({ values }) => {
  const { type } = values;

  switch (type) {
    case FormStorageType.S3:
      return <S3Fields values={values} />;
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

export const AddStorageLocationModal: FC<AddStorageLocationModalProps> = ({ isVisible, location, onClose }) => {
  const initialValues = toFormStorageLocation(location);

  const onSubmit = (values: AddStorageLocationFormProps) => {};

  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={onClose}>
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ handleSubmit, valid, values }) => (
          <form onSubmit={handleSubmit}>
            <TextInputField name="name" label={Messages.name} validators={[validators.required]} />
            <TextareaInputField name="description" validators={[validators.required]} />
            <RadioButtonGroupField options={typeOptions} name="type" fullWidth />
            <TypeField values={values} />
          </form>
        )}
      />
    </Modal>
  );
};

AddStorageLocationModal.defaultProps = {
  onClose: () => null,
};
