import React, { useState } from 'react';

import { Button, IconButton, useStyles2 } from '@grafana/ui';

import { InfoModal } from '../InfoModal/InfoModal';

import { Messages } from './NavActions.messages';
import { getStyles } from './NavActions.styles';

export const NavActions = () => {
  const [openModal, setOpenModal] = useState(false);
  const styles = useStyles2(getStyles);
  return (
    <>
      <div className={styles.navActions}>
        <IconButton name="info-circle" size="lg" onClick={() => setOpenModal(true)} />
        <Button onClick={() => {}}>{Messages.buttonLabel}</Button>
      </div>
      <InfoModal isOpen={openModal} closeModal={() => setOpenModal(false)} />
    </>
  );
};
