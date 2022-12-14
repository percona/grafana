import { TextareaInputField } from '@percona/platform-core';
import React, { FC } from 'react';

import FieldSet from '../../../../../../shared/components/Form/FieldSet/FieldSet';
import { Messages } from '../DBClusterAdvancedOptions.messages';

import { MySQLConfigurationFields } from './MySQLConfigurations.types';

export const MySQLConfigurations: FC = () => {
  return (
    <FieldSet label={Messages.fieldSets.pxcConfiguration} dataTestId={'pxc-configurations'}>
      {/*<AsyncSelectField*/}
      {/*  name={MySQLConfigurationFields.storageClass}*/}
      {/*  loadOptions={loadAsyncOptions}*/}
      {/*  label={Messages.labels.storageClass}*/}
      {/*/>*/}
      <TextareaInputField name={MySQLConfigurationFields.pxcConfiguration} label={Messages.labels.pxcConfiguration} />
    </FieldSet>
  );
};

export default MySQLConfigurations;
