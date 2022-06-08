import { useStyles2 } from '@grafana/ui';
import { getPerconaServer, getPerconaUser } from 'app/percona/shared/core/selectors';
import React from 'react';
import { useSelector } from 'react-redux';
import { Messages } from './ModalBody.messages';
import { getStyles } from './ModalBody.styles';

export const ModalBody = () => {
  const { isPlatformUser } = useSelector(getPerconaUser);
  const { saasHost } = useSelector(getPerconaServer);
  const styles = useStyles2(getStyles);
  return (
    <p>
      {isPlatformUser ? Messages.modalBodyPlatformUser : Messages.modalBody} <br />
      {Messages.modalBodySecondMessage}
      <a href={`${saasHost}/pmm-instances`} rel="noreferrer noopener" target="_blank" className={styles.link}>
        Portal instances
      </a>
      .
    </p>
  );
};
