import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { SecretToggler } from '../SecretToggler';
import { KeysBlockProps } from './KeysBlock.types';
import { getStyles } from './KeysBlock.styles';
import { Messages } from './KeysBlock.messages';
import { Form } from 'react-final-form';

export const KeysBlock: FC<KeysBlockProps> = ({ accessKey, secretKey }) => {
  const styles = useStyles(getStyles);

  return (
    <div>
      <div data-qa="access-key">
        <span className={styles.keyLabel}>{Messages.accessKey}</span>
        {accessKey}
      </div>
      <div data-qa="secret-key">
        <span className={styles.keyLabel}>{Messages.secretKey}</span>
        <Form
          onSubmit={() => null}
          render={() => (
            <span className={styles.secretTogglerWrapper}>
              <SecretToggler minified secret={secretKey} />
            </span>
          )}
        ></Form>
      </div>
    </div>
  );
};
