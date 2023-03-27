import React, { FC } from 'react';

import { Button, IconName, useStyles2 } from '@grafana/ui';

import { UpgradeButtonProps } from '../../types';

import { Messages } from './UpgradeButton.messages';
import { getStyles } from './UpgradeButton.styles';

export const UpgradeButton: FC<UpgradeButtonProps> = ({ onClick, upgradeServiceAvailable, nextVersion }) => {
  const styles = useStyles2(getStyles);

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */}
      <Button onClick={onClick} icon={'fa fa-download' as IconName} variant="secondary">
        {Messages.upgradeTo(nextVersion)}
      </Button>
      {!upgradeServiceAvailable && (
        // TODO: update wording and docs link
        <p data-testid="upgrade-service-unavailable-message" className={styles.notAvailable}>
          {Messages.upgradeServiceUnavailable.first}
          <a className={styles.link} href="/">
            {Messages.upgradeServiceUnavailable.docs}
          </a>
          {Messages.upgradeServiceUnavailable.last}
        </p>
      )}
    </>
  );
};
