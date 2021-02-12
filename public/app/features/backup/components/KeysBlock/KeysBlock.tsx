import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { SecretToggler } from '../SecretToggler';
import { KeysBlockProps } from './KeysBlock.types';
import { getStyles } from './KeysBlock.styles';

export const KeysBlock: FC<KeysBlockProps> = ({ accessKey, secretKey }) => {
  const styles = useStyles(getStyles);

  return (
    <div>
      <div>
        <span className={styles.keyLabel}>Access Key</span>
        {accessKey}
      </div>
      <div>
        <span className={styles.keyLabel}>Secret Key</span>
        <SecretToggler secret={secretKey} />
      </div>
    </div>
  );
};
