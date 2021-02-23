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
  TypeFieldProps,
} from './AddStorageLocationModal.types';
import { getStyles } from './AddStorageLocationModal.styles';
import { S3Fields } from './S3Fields';
import { LocalFields } from './LocalFields';
import { toFormStorageLocation, toStorageLocation } from './AddStorageLocation.utils';
import { Button, HorizontalGroup, useStyles } from '@grafana/ui';
import { LocationType } from '../StorageLocations.types';

const TypeField: FC<TypeFieldProps> = ({ values }) => {
  const { type, client, server, endpoint, accessKey, secretKey } = values;
  const fieldMap = {
    [LocationType.S3]: <S3Fields endpoint={endpoint} accessKey={accessKey} secretKey={secretKey} />,
    [LocationType.SERVER]: <LocalFields name="server" path={server} />,
    [LocationType.CLIENT]: <LocalFields name="client" path={client} />,
  };

  return type in fieldMap ? fieldMap[type] : null;
};

const typeOptions: Array<SelectableValue<LocationType>> = [
  {
    value: LocationType.S3,
    label: 'S3',
  },
  {
    value: LocationType.CLIENT,
    label: 'Local Client',
  },
  {
    value: LocationType.SERVER,
    label: 'Local Server',
  },
];

const { Form } = withTypes<AddStorageLocationFormProps>();
const required = [validators.required];

export const AddStorageLocationModal: FC<AddStorageLocationModalProps> = ({
  isVisible,
  location,
  needsLocationValidation,
  onClose,
  onAdd,
}) => {
  const initialValues = toFormStorageLocation(location);
  const styles = useStyles(getStyles);
  const onSubmit = (values: AddStorageLocationFormProps) => onAdd(toStorageLocation(values));

  return (
    <Modal title={Messages.title} isVisible={isVisible} onClose={onClose}>
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ handleSubmit, valid, pristine, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <TextInputField name="name" label={Messages.name} validators={required} />
            <TextareaInputField name="description" label={Messages.description} validators={required} />
            {/* TODO remove disabled when API allows all three types */}
            <RadioButtonGroupField disabled options={typeOptions} name="type" label={Messages.type} fullWidth />
            <TypeField values={values} />
            <HorizontalGroup justify="center" spacing="md">
              <LoaderButton
                data-qa="storage-location-add-button"
                size="md"
                variant="primary"
                disabled={!valid || pristine}
                loading={submitting}
              >
                {location ? Messages.editAction : Messages.addAction}
              </LoaderButton>
              {needsLocationValidation ? (
                <LoaderButton className={styles.testButton} data-qa="storage-location-test-button" size="md">
                  {Messages.test}
                </LoaderButton>
              ) : null}
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
