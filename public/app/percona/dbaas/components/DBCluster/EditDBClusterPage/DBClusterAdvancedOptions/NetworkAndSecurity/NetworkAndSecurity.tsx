import { CheckboxField, TextInputField, validators } from '@percona/platform-core';
import React, { FC } from 'react';
import { FieldArray } from 'react-final-form-arrays';

import { useStyles, Button } from '@grafana/ui';

import FieldSet from '../../../../../../shared/components/Form/FieldSet/FieldSet';
import { Messages } from '../DBClusterAdvancedOptions.messages';

import { getStyles } from './NetworkAndSecurity.styles';
const { required } = validators;
import { NetworkAndSecurityFields } from './NetworkAndSecurity.types';

export interface NetworkAndSecurityProps {}
export const NetworkAndSecurity: FC<NetworkAndSecurityProps> = () => {
  const styles = useStyles(getStyles);
  return (
    <FieldSet label={Messages.fieldSets.networkAndSecurity} dataTestId={'network-and-security'}>
      <div className={styles.errorWrapper}>
        <CheckboxField name={NetworkAndSecurityFields.expose} label={Messages.labels.expose} />
      </div>
      <CheckboxField name={NetworkAndSecurityFields.internetFacing} label={Messages.labels.internetFacing} />
      <FieldArray name={NetworkAndSecurityFields.sourceRanges}>
        {({ fields }) => (
          <div className={styles.fieldsWrapper}>
            <Button
              className={styles.button}
              variant="secondary"
              onClick={() => fields.push({ sourceRange: '' })}
              icon="plus"
            >
              {Messages.buttons.addNew}
            </Button>
            {fields.map((name, index) => (
              <div key={name}>
                <TextInputField
                  name={`${name}.sourceRange`}
                  label={index === 0 ? Messages.labels.sourceRange : ''}
                  validators={index === 0 ? [required] : []}
                  placeholder="181.170.213.40/32"
                />
              </div>
            ))}
          </div>
        )}
      </FieldArray>
    </FieldSet>
  );
};

export default NetworkAndSecurity;
