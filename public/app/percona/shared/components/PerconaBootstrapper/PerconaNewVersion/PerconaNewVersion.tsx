import React from 'react';

import { Modal, useStyles2, Button, LinkButton } from '@grafana/ui';

import { Messages, MIGRATION_LINK_URL, DOCUMENTATION_LINK_URL } from './PerconaNewVersion.constants';
import { getStyles } from './PerconaNewVersion.styles';
import { PerconaNewVersionProps } from './PerconaNewVersion.types';

const PerconaNewVersion = ({ isOpen, onDismiss }: PerconaNewVersionProps) => {
  const styles = useStyles2(getStyles);

  return (
    <>
      <Modal onDismiss={onDismiss} title={Messages.titleNewVersion} isOpen={isOpen} className={styles.newVersionModal}>
        <div data-testid="new-version-modal">
          <span>
            {Messages.description}
            <a className={styles.link} href={DOCUMENTATION_LINK_URL}>
              {Messages.seeWhatsNew}
            </a>
          </span>
          <div className={styles.buttons}>
            <Button type="button" variant="secondary" onClick={onDismiss} className={styles.closeButton}>
              {Messages.close}
            </Button>
            <LinkButton href={MIGRATION_LINK_URL}>{Messages.viewMigrationGuide}</LinkButton>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PerconaNewVersion;
