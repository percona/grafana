import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { UpgradeSection } from './UpgradeSection';

const installedVersionDetails = {
  installedVersion: '0.0.1',
};
const nextVersionDetails = {
  nextVersion: '0.0.2',
  newsLink: '',
};
const onClick = jest.fn();

jest.mock('../../hooks', () => ({
  useVersionDetails: () => [{ installedVersionDetails, nextVersionDetails }],
}));

describe('UpgradeSection::', () => {
  it('shows message when upgrade service is unavailable', () => {
    render(
      <UpgradeSection
        nextVersion={installedVersionDetails.installedVersion}
        onUpdateStart={onClick}
        upgradeServiceAvailable={false}
      />
    );
    expect(screen.queryByTestId('upgrade-service-unavailable-message')).toBeInTheDocument();
  });

  it("doesn't show message when upgrade service is available", () => {
    render(
      <UpgradeSection
        nextVersion={installedVersionDetails.installedVersion}
        onUpdateStart={onClick}
        upgradeServiceAvailable
      />
    );
    expect(screen.queryByTestId('upgrade-service-unavailable-message')).toBeNull();
  });

  it('opens modal when update button is clicked', async () => {
    render(
      <UpgradeSection
        nextVersion={installedVersionDetails.installedVersion}
        onUpdateStart={onClick}
        upgradeServiceAvailable
      />
    );

    const upgradeButton = screen.getByTestId('upgrade-button');

    fireEvent.click(upgradeButton);

    await waitFor(() => expect(screen.queryByText('PMM Upgrade')).toBeInTheDocument());
  });
});
