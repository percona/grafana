import { Icon, useStyles } from '@grafana/ui';
import React, { FC, useState, useMemo } from 'react';
import { SecretTogglerProps } from './SecretToggler.types';
import { getStyles } from './SecretToggler.styles';

export const SecretToggler: FC<SecretTogglerProps> = ({ secret, readOnly }) => {
  const [visible, setVisible] = useState(false);
  const styles = useStyles(getStyles);

  const toggleVisibility = () => setVisible(visible => !visible);

  const iconButton = useMemo(
    () => <Icon className={styles.lock} onClick={toggleVisibility} name={visible ? 'eye-slash' : 'eye'} />,
    [visible]
  );

  return (
    <span>
      <input className={styles.input} type={visible ? 'text' : 'password'} readOnly={readOnly} value={secret}></input>
      {iconButton}
    </span>
  );
};

SecretToggler.defaultProps = {
  readOnly: true,
};
