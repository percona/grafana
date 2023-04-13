import { TextareaInputField, AsyncSelectField } from '@percona/platform-core';
import React, { FC } from 'react';

import FieldSet from '../../../../../../shared/components/Form/FieldSet/FieldSet';
import { Databases } from '../../../../../../shared/core';
import { Messages } from '../DBClusterAdvancedOptions.messages';

import { ConfigurationService } from './Configurations.service';
import { ConfigurationFields, ConfigurationProps } from './Configurations.types';

export const Configurations: FC<ConfigurationProps> = ({ form, mode, databaseType, k8sClusterName }) => {
  const label = databaseType ? Messages.labels.configuration(databaseType) : Messages.labels.commonConfiguration;
  const fieldSetLabel = databaseType
    ? Messages.fieldSets.configuration(databaseType)
    : Messages.fieldSets.commonConfiguration;

  return (
    <FieldSet label={fieldSetLabel} data-testid="configurations">
      <AsyncSelectField
        name={ConfigurationFields.storageClass}
        loadOptions={() => ConfigurationService.loadStorageClassOptions(k8sClusterName)}
        defaultOptions
        placeholder={Messages.placeholders.storageClass}
        label={Messages.labels.storageClass}
        disabled={mode === 'edit'}
      />
      {databaseType !== Databases.postgresql && (
        <TextareaInputField
          name={ConfigurationFields.configuration}
          label={label}
          inputProps={{
            onBlur: (event) => {
              form.mutators.trimConfiguration(event?.target?.value);
            },
          }}
        />
      )}
    </FieldSet>
  );
};

export default Configurations;
