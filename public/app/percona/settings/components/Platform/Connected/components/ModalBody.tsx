import React from 'react';
import { Checkbox, useStyles2 } from '@grafana/ui';
import { Messages } from './ModalBody.messages';
import { getStyles } from './ModalBody.styles';

interface Props {
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
}

export const ModalBody = ({ isChecked, setIsChecked }: Props) => {
  const styles = useStyles2(getStyles);
  return (
    <div>
      {Messages.modalBody}
      <div className={styles.checkboxWrapper}>
        <Checkbox className={styles.checkbox} value={isChecked} onChange={() => setIsChecked(!isChecked)} />{' '}
        {Messages.forceDisconnect}
      </div>
    </div>
  );
};
