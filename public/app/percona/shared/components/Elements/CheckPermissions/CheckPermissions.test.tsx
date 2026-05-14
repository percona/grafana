import { render, screen } from '@testing-library/react';

import { SettingsService } from 'app/percona/settings/Settings.service';

import { CheckPermissions } from './CheckPermissions';

jest.mock('app/percona/settings/Settings.service');
jest.mock('app/percona/shared/helpers/logger', () => {
  const originalModule = jest.requireActual('app/percona/shared/helpers/logger');
  return {
    ...originalModule,
    logger: {
      error: jest.fn(),
    },
  };
});

describe('CheckPermissions::', () => {
  it('should render children', async () => {
    render(
      <CheckPermissions>
        <div>Test</div>
      </CheckPermissions>
    );

    expect(await screen.findByText('Test')).toBeInTheDocument();
  });

  it('should render unauthorized message', async () => {
    const errorObj = { response: { status: 401 } };
    jest.spyOn(SettingsService, 'getSettings').mockImplementationOnce(() => {
      throw errorObj;
    });
    render(
      <CheckPermissions>
        <div>Test</div>
      </CheckPermissions>
    );

    expect(await screen.findByTestId('unauthorized')).toBeInTheDocument();
  });
});
