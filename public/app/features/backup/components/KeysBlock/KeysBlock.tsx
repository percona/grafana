import React, { FC } from 'react';
import { SecretToggler } from '../SecretToggler';
import { KeysBlockProps } from './KeysBlock.types';

export const KeysBlock: FC<KeysBlockProps> = ({ accessKey, secretKey }) => (
  <div>
    <div>
      <span>Access Key</span>
      {accessKey}
    </div>
    <div>
      <span>Secret Key</span>
      <SecretToggler secret={secretKey} />
    </div>
  </div>
);
