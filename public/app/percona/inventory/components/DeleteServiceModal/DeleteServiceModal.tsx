import { logger } from '@percona/platform-core';
import React, { useState } from 'react';

import { AppEvents } from '@grafana/data';
import { Alert, Button, Checkbox, Modal } from '@grafana/ui';
import { appEvents } from 'app/core/core';
import { removeServiceAction, RemoveServiceParams } from 'app/percona/shared/core/reducers/services';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import { useAppDispatch } from 'app/store/store';

import { Messages } from './DeleteServiceModal.messages';
import { styles } from './DeleteServiceModal.styles';

interface DeleteServiceModalProps {
  serviceId: string;
  serviceName: string;
  isOpen: boolean;
  onCancel: () => void;
}

const DeleteServiceModal: React.FC<DeleteServiceModalProps> = ({ serviceId, serviceName, isOpen, onCancel }) => {
  const [forceModeActive, setForceActive] = useState(false);
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    try {
      const params: RemoveServiceParams = {
        serviceId: serviceId,
        force: forceModeActive,
      };

      await dispatch(removeServiceAction(params)).unwrap();

      appEvents.emit(AppEvents.alertSuccess, [Messages.success(serviceName)]);
      onCancel();
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
  };

  return (
    <Modal isOpen={isOpen} title={Messages.title} onDismiss={onCancel} className={styles.Modal}>
      <Alert title={Messages.warning} severity="warning" />
      <p>{Messages.description(serviceName)}</p>
      <div>
        <Checkbox
          data-testid="delete-service-force-mode"
          label={Messages.forceMode.label}
          description={Messages.forceMode.description}
          value={forceModeActive}
          onChange={() => setForceActive((active) => !active)}
        />
      </div>
      <Modal.ButtonRow>
        <Button data-testid="delete-service-confirm" onClick={handleDelete}>
          {Messages.submit}
        </Button>
        <Button data-testid="delete-service-cancel" variant="secondary" onClick={onCancel}>
          {Messages.cancel}
        </Button>
      </Modal.ButtonRow>
    </Modal>
  );
};

export default DeleteServiceModal;
