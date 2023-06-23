import React, { FC, useMemo } from 'react';

import { AsyncSelectFieldCore } from 'app/percona/shared/components/Form/AsyncSelectFieldCore';
import { TextareaInputField } from 'app/percona/shared/components/Form/TextareaInput';

import FieldSet from '../../../../../../shared/components/Form/FieldSet/FieldSet';
import { Databases } from '../../../../../../shared/core';
import { Messages } from '../DBClusterAdvancedOptions.messages';

import { ConfigurationService } from './Configurations.service';
import { ConfigurationFields, ConfigurationProps } from './Configurations.types';

export const Configurations: FC<ConfigurationProps> = ({ form, mode, databaseType, k8sClusterName }) => {
  const label = useMemo(
    () =>
      databaseType === Databases.mysql
        ? Messages.labels.pxcConfiguration
        : databaseType === Databases.mongodb
        ? Messages.labels.mongodbConfiguration
        : Messages.labels.commonConfiguration,
    [databaseType]
  );
  const fieldSetLabel = useMemo(
    () =>
      databaseType === Databases.mysql
        ? Messages.fieldSets.pxcConfiguration
        : databaseType === Databases.mongodb
        ? Messages.fieldSets.mongodbConfiguration
        : Messages.fieldSets.commonConfiguration,
    [databaseType]
  );

  return (
    <FieldSet label={fieldSetLabel} data-testid="configurations">
      <AsyncSelectFieldCore
        name={ConfigurationFields.storageClass}
        loadOptions={() => ConfigurationService.loadStorageClassOptions(k8sClusterName)}
        defaultOptions
        placeholder={Messages.placeholders.storageClass}
        label={Messages.labels.storageClass}
        disabled={mode === 'edit'}
      />
      <TextareaInputField
        name={ConfigurationFields.configuration}
        label={label}
        inputProps={{
          onBlur: (event) => {
            form.mutators.trimConfiguration(event?.target?.value);
          },
        }}
      />
    </FieldSet>
  );
};

export default Configurations;
