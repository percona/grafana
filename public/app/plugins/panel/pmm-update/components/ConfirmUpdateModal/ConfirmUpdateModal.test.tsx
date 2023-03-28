import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { ConfirmUpdateModal } from './ConfirmUpdateModal';
import { Messages } from './ConfirmUpdateModal.messages';

const installedVersionDetails = {
  installedVersion: '0.0.1',
};
const nextVersionDetails = {
  nextVersion: '0.0.2',
  newsLink: '',
};

jest.mock('../../hooks', () => ({
  useVersionDetails: () => [{ installedVersionDetails, nextVersionDetails }],
}));

const onCancelMock = jest.fn();
const onConfirmMock = jest.fn();

const renderDefault = () => render(<ConfirmUpdateModal isOpen onCancel={onCancelMock} onConfirm={onConfirmMock} />);

describe('ConfirmUpdateModal::', () => {
  beforeEach(() => {
    onCancelMock.mockClear();
    onConfirmMock.mockClear();
  });

  it('shows versions correctly', () => {
    renderDefault();

    const text = Messages.version(installedVersionDetails.installedVersion, nextVersionDetails.nextVersion);

    expect(screen.getByText(text, { exact: false })).toBeInTheDocument();
  });

  it('correctly calls cancel', () => {
    renderDefault();

    const cancelBtn = screen.getByTestId('cancel-update-btn');

    fireEvent.click(cancelBtn);

    expect(onCancelMock).toHaveBeenCalled();
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  it('correctly calls confirm', () => {
    renderDefault();

    const confirmBtn = screen.getByTestId('confirm-update-btn');

    fireEvent.click(confirmBtn);

    expect(onCancelMock).not.toHaveBeenCalled();
    expect(onConfirmMock).toHaveBeenCalled();
  });
});
