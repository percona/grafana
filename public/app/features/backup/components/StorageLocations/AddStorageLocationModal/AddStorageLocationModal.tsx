import React, { FC, useEffect } from 'react';
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
import { cx } from 'emotion';
import { useState } from 'react';

const TypeField: FC<TypeFieldProps> = ({ values, onPathChanged = () => null }) => {
  const { type, client, server, endpoint, accessKey, secretKey } = values;
  const fieldMap = {
    [LocationType.S3]: (
      <S3Fields endpoint={endpoint} accessKey={accessKey} secretKey={secretKey} onPathChanged={onPathChanged} />
    ),
    [LocationType.SERVER]: <LocalFields name="server" path={server} onPathChanged={onPathChanged} />,
    [LocationType.CLIENT]: <LocalFields name="client" path={client} onPathChanged={onPathChanged} />,
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
  locationValid,
  waitingLocationValidation,
  onClose,
  onAdd,
  onTest = () => null,
}) => {
  const initialValues = toFormStorageLocation(location);
  const styles = useStyles(getStyles);
  const [locationValidated, setLocationValidated] = useState(!!(needsLocationValidation && locationValid));
  const onSubmit = (values: AddStorageLocationFormProps) => onAdd(toStorageLocation(values));

  const handleTestClick = (values: AddStorageLocationFormProps) => {
    const location = toStorageLocation(values);
    onTest(location);
  };

  const handlePathChange = () => setLocationValidated(false);

  useEffect(() => {
    setLocationValidated(!!(needsLocationValidation && locationValid));
  }, [needsLocationValidation, locationValid]);

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
            <TypeField values={values} onPathChanged={handlePathChange} />
            <HorizontalGroup justify="center" spacing="md">
              <LoaderButton
                className={styles.button}
                data-qa="storage-location-add-button"
                size="md"
                variant="primary"
                disabled={
                  !valid || pristine || (needsLocationValidation && (!locationValidated || waitingLocationValidation))
                }
                loading={submitting}
              >
                {location ? Messages.editAction : Messages.addAction}
              </LoaderButton>
              {needsLocationValidation ? (
                <LoaderButton
                  type="button"
                  className={cx(styles.button, styles.testButton)}
                  data-qa="storage-location-test-button"
                  size="md"
                  loading={waitingLocationValidation}
                  disabled={!valid}
                  onClick={() => handleTestClick(values)}
                >
                  {Messages.test}
                </LoaderButton>
              ) : null}
              <Button
                className={styles.button}
                data-qa="storage-location-cancel-button"
                variant="secondary"
                onClick={onClose}
              >
                {Messages.cancelAction}
              </Button>
            </HorizontalGroup>
          </form>
        )}
      />
    </Modal>
  );
};
