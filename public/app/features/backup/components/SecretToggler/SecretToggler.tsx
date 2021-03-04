import { Icon, useStyles } from '@grafana/ui';
import React, { FC, useState, useMemo } from 'react';
import { SecretTogglerProps } from './SecretToggler.types';
import { getStyles } from './SecretToggler.styles';
import { MAX_SECRET_LENGTH } from './SecretToggler.constants';
import { TextInputField } from '@percona/platform-core';
import { cx } from 'emotion';

export const SecretToggler: FC<SecretTogglerProps> = ({ secret, readOnly, fieldProps, small }) => {
  const [visible, setVisible] = useState(false);
  const styles = useStyles(getStyles);

  const toggleVisibility = () => setVisible(visible => !visible);

  const iconButton = useMemo(
    () => (
      <Icon
        size={small ? 'sm' : 'lg'}
        className={cx(styles.lock, small ? [] : styles.fullLock)}
        onClick={toggleVisibility}
        name={visible ? 'eye-slash' : 'eye'}
      />
    ),
    [visible, small]
  );

  const hiddenSecret = useMemo(() => secret?.replace(/./g, '*'), [secret]);

  return (
    <div className={styles.fieldWrapper}>
      {small ? (
        <span data-qa="small-secret-holder" className={styles.smallPassword}>
          {visible ? secret : hiddenSecret}
        </span>
      ) : (
        <TextInputField
          name={fieldProps?.name || 'secret'}
          inputProps={{ type: visible ? 'text' : 'password', readOnly, maxLength: MAX_SECRET_LENGTH }}
          initialValue={secret}
          {...fieldProps}
        />
      )}
      {iconButton}
    </div>
  );
};

SecretToggler.defaultProps = {
  readOnly: true,
  small: false,
};
