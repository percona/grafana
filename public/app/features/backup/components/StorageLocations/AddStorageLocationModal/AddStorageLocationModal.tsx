import React, { FC } from 'react';
import { Modal } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { Form } from 'react-final-form';
import { TextInputField, TextareaInputField, RadioButtonGroupField, validators } from '@percona/platform-core';
import { Messages } from './AddStorageLocationModal.messages';

const typeOptions: SelectableValue[] = [
  {
    value: 'S3',
    label: 'S3',
  },
  {
    value: 'client',
    label: 'Local Client',
  },
  {
    value: 'server',
    label: 'Local Server',
  },
];

export const AddStorageLocationModal: FC = () => {
  return (
    <Modal title={Messages.title}>
      <Form
        onSubmit={() => null}
        render={({ handleSubmit, valid, values }) => (
          <form onSubmit={handleSubmit}>
            <TextInputField name="name" label={Messages.name} validators={[validators.required]} />
            <TextareaInputField name="description" validators={[validators.required]} />
            <RadioButtonGroupField options={typeOptions} name="type" fullWidth />
          </form>
        )}
      />
    </Modal>
  );
};
