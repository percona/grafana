import React from 'react';
import { Checkbox, useStyles2 } from '@grafana/ui';
import { Messages } from './ModalBody.messages';
import { getStyles } from './ModalBody.styles';
import { useSelector } from 'react-redux';
import { getPerconaUser } from 'app/percona/shared/core/selectors';
import { ModalBodyProps } from './ModalBody.types';

export const ModalBody = ({ isChecked, setIsChecked }: ModalBodyProps) => {
  const { isPlatformUser } = useSelector(getPerconaUser);
  const styles = useStyles2(getStyles);
  return (
    <div>
      {isPlatformUser ? (
        Messages.modalBodyPlatformUser
      ) : (
        <>
          {Messages.modalBody}
          <div className={styles.checkboxWrapper}>
            <Checkbox className={styles.checkbox} value={isChecked} onChange={() => setIsChecked(!isChecked)} />{' '}
            {Messages.forceDisconnect}
          </div>
        </>
      )}
    </div>
  );
};
