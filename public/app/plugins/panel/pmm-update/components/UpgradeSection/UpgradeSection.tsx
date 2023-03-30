import React, { FC, useState } from 'react';

import { Button, IconName, useStyles2 } from '@grafana/ui';

import { UpgradeSectionProps } from '../../types';
import { ConfirmUpdateModal } from '../ConfirmUpdateModal/ConfirmUpdateModal';

import { Messages } from './UpgradeSection.messages';
import { getStyles } from './UpgradeSection.styles';

export const UpgradeSection: FC<UpgradeSectionProps> = ({ onUpdateStart, upgradeServiceAvailable, nextVersion }) => {
  const styles = useStyles2(getStyles);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    onUpdateStart();
  };

  return (
    <div className={styles.container}>
      <ConfirmUpdateModal isOpen={isModalOpen} onCancel={handleCancel} onConfirm={handleConfirm} />
      {/* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */}
      <Button data-testid="upgrade-button" onClick={handleOpen} icon={'fa fa-download' as IconName} variant="secondary">
        {Messages.upgradeTo(nextVersion)}
      </Button>
      {!upgradeServiceAvailable && (
        // TODO: update wording and docs link
        <p data-testid="upgrade-service-unavailable-message" className={styles.notAvailable}>
          {Messages.upgradeServiceUnavailable.first}
          <a className={styles.link} rel="noopener noreferrer" target="_blank" href="/">
            {Messages.upgradeServiceUnavailable.docs}
          </a>
          {Messages.upgradeServiceUnavailable.last}
        </p>
      )}
    </div>
  );
};
