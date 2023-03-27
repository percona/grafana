import { render, screen } from '@testing-library/react';
import React from 'react';

import { UpgradeButton } from './UpgradeButton';

describe('UpgradeButton::', () => {
  const version = '0.0.0';
  const onClick = jest.fn();

  it('shows message when upgrade service is unavailable', () => {
    render(<UpgradeButton nextVersion={version} onClick={onClick} upgradeServiceAvailable={false} />);
    expect(screen.queryByTestId('upgrade-service-unavailable-message')).toBeInTheDocument();
  });

  it("doesn't show message when upgrade service is available", () => {
    render(<UpgradeButton nextVersion={version} onClick={onClick} upgradeServiceAvailable />);
    expect(screen.queryByTestId('upgrade-service-unavailable-message')).toBeNull();
  });
});
