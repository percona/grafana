import React, { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmModal, useStyles2 } from '@grafana/ui';
import { config } from '@grafana/runtime';
import { Form } from 'react-final-form';
import { LoaderButton, logger, TextInputField } from '@percona/platform-core';
import { getPerconaServer, getPerconaUser } from 'app/percona/shared/core/selectors';
import { PlatformService } from '../Platform.service';
import { Messages as PlatformMessages } from '../Platform.messages';
import { Messages } from './Connected.messages';
import { getStyles } from './Connected.styles';
import { fetchServerInfoAction, fetchSettingsAction } from 'app/percona/shared/core/reducers';
import { appEvents } from 'app/core/app_events';
import { AppEvents } from '@grafana/data';
import { ModalBody } from './ModalBody/ModalBody';

export const Connected: FC = () => {
  const styles = useStyles2(getStyles);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { serverId = '', serverName = '' } = useSelector(getPerconaServer);
  const { isPlatformUser } = useSelector(getPerconaUser);
  const dispatch = useDispatch();

  const handleDisconnect = async () => {
    setDisconnecting(true);
    closeModal();
    try {
      await PlatformService.disconnect();
      setTimeout(() => {
        window.location.assign(`${config.appSubUrl}/logout`);
        return;
      }, 3000);
    } catch (e) {
      logger.error(e);
      setDisconnecting(false);
    }
  };

  const handleForceDisconnect = async () => {
    setDisconnecting(true);
    closeModal();
    try {
      await PlatformService.forceDisconnect();
      appEvents.emit(AppEvents.alertSuccess, [Messages.forceDisconnectSucceeded]);
      setDisconnecting(false);
      dispatch(fetchServerInfoAction());
      dispatch(fetchSettingsAction());
    } catch (e) {
      logger.error(e);
      setDisconnecting(false);
    }
  };

  const closeModal = useCallback(() => setShowModal(false), []);
  const openModal = useCallback(() => setShowModal(true), []);

  return (
    <>
      <section data-testid="connected-wrapper" className={styles.wrapper}>
        <header className={styles.title}>{Messages.title}</header>
        <p>{Messages.connected}</p>
        <Form
          initialValues={{ pmmServerId: serverId, pmmServerName: serverName }}
          onSubmit={() => {}}
          render={() => (
            <form>
              <TextInputField name="pmmServerId" disabled label={PlatformMessages.pmmServerId} />
              <TextInputField name="pmmServerName" disabled label={PlatformMessages.pmmServerName} />
            </form>
          )}
        />
        <LoaderButton
          data-testid="disconnect-button"
          size="md"
          variant="primary"
          disabled={disconnecting}
          loading={disconnecting}
          onClick={openModal}
        >
          {Messages.disconnect}
        </LoaderButton>
      </section>
      <ConfirmModal
        body={<ModalBody />}
        confirmText={Messages.disconnect}
        isOpen={showModal}
        title={Messages.modalTitle}
        onDismiss={closeModal}
        onConfirm={isPlatformUser ? handleDisconnect : handleForceDisconnect}
      />
    </>
  );
};
