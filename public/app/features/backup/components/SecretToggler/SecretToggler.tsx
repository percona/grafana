import { Icon, useStyles } from '@grafana/ui';
import React, { FC, useState, useMemo } from 'react';
import { SecretTogglerProps } from './SecretToggler.types';
import { getStyles } from './SecretToggler.styles';
import { TextInputField } from '@percona/platform-core';
import { cx } from 'emotion';

export const SecretToggler: FC<SecretTogglerProps> = ({ secret, readOnly, fieldProps, minified }) => {
  const [visible, setVisible] = useState(false);
  const styles = useStyles(getStyles);

  const toggleVisibility = () => setVisible(visible => !visible);

  const iconButton = useMemo(
    () => (
      <Icon
        size={minified ? 'sm' : 'lg'}
        className={cx(styles.lock, minified ? [] : styles.fullLock)}
        onClick={toggleVisibility}
        name={visible ? 'lock' : 'unlock'}
      />
    ),
    [visible, minified]
  );

  return (
    <div className={styles.fieldWrapper}>
      {minified ? (
        <input className={styles.input} type={visible ? 'text' : 'password'} readOnly={readOnly} value={secret}></input>
      ) : (
        <TextInputField
          name={fieldProps?.name || 'secret'}
          inputProps={{ type: visible ? 'text' : 'password', readOnly }}
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
  minified: false,
};
