import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { isS3Location } from '../StorageLocations.utils';
import { DescriptionBlock } from '../../DescriptionBlock';
import { StorageLocationDetailsProps } from './StorageLocationDetails.types';
import { getStyles } from './StorageLocationDetails.styles';
import { KeysBlock } from '../../KeysBlock';

export const StorageLocationDetails: FC<StorageLocationDetailsProps> = ({ location }) => {
  const { description } = location;
  const styles = useStyles(getStyles);

  return (
    <div className={styles.wrapper}>
      <DescriptionBlock description={description} />
      {isS3Location(location) ? <KeysBlock accessKey={location.accessKey} secretKey={location.secretKey} /> : null}
    </div>
  );
};
