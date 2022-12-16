import { TextareaInputField } from '@percona/platform-core';
import React, { FC, useMemo } from 'react';

import FieldSet from '../../../../../../shared/components/Form/FieldSet/FieldSet';
import { Databases } from '../../../../../../shared/core';
import { Messages } from '../DBClusterAdvancedOptions.messages';

import { ConfigurationFields, ConfigurationProps } from './Configurations.types';

export const Configurations: FC<ConfigurationProps> = ({ databaseType }) => {
  const label = useMemo(
    () =>
      databaseType === Databases.mysql
        ? Messages.labels.pxcConfiguration
        : databaseType === Databases.mongodb
        ? Messages.labels.mongodbConfiguration
        : 'Database Configuration',
    [databaseType]
  );
  const fieldSetLabel = useMemo(
    () =>
      databaseType === Databases.mysql
        ? Messages.fieldSets.pxcConfiguration
        : databaseType === Databases.mongodb
        ? Messages.labels.mongodbConfiguration
        : 'Database Configuration',
    [databaseType]
  );
  return (
    <FieldSet label={fieldSetLabel} dataTestId={'pxc-configurations'}>
      {/*<AsyncSelectField*/}
      {/*  name={MySQLConfigurationFields.storageClass}*/}
      {/*  loadOptions={loadAsyncOptions}*/}
      {/*  label={Messages.labels.storageClass}*/}
      {/*/>*/}
      <TextareaInputField name={ConfigurationFields.configuration} label={label} />
    </FieldSet>
  );
};

export default Configurations;
