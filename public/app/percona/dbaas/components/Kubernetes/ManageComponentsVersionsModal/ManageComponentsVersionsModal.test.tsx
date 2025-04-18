import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { kubernetesStub } from '../__mocks__/kubernetesStubs';

import { ManageComponentsVersionsModal } from './ManageComponentsVersionsModal';
import {
  operatorsOptionsStubs,
  psmdbComponentOptionsStubs,
  versionsFieldNameStub,
  versionsStubs,
} from './__mocks__/componentsVersionsStubs';

jest.mock('app/core/app_events');
jest.mock('./ManageComponentsVersions.hooks');

describe('ManageComponentsVersionsModal::', () => {
  it('renders form with operator, component and versions field with correct values', () => {
    render(
      <ManageComponentsVersionsModal
        setSelectedCluster={() => {}}
        isVisible
        selectedKubernetes={kubernetesStub[0]}
        setVisible={jest.fn()}
      />
    );

    expect(
      screen.getByTestId('kubernetes-operator').textContent?.includes(operatorsOptionsStubs[0].label)
    ).toBeTruthy();
    expect(
      screen.getByTestId('kubernetes-component').textContent?.includes(psmdbComponentOptionsStubs[0].label)
    ).toBeTruthy();
    expect(screen.getByTestId(`${versionsFieldNameStub}-options`).children).toHaveLength(versionsStubs.length);
    expect(screen.getByTestId('kubernetes-default-version')).toBeInTheDocument();
  });
  it('calls setVisible on cancel', () => {
    const setVisible = jest.fn();
    render(
      <ManageComponentsVersionsModal
        setSelectedCluster={() => {}}
        isVisible
        selectedKubernetes={kubernetesStub[0]}
        setVisible={setVisible}
      />
    );

    const btn = screen.getByTestId('kubernetes-components-versions-cancel');
    fireEvent.click(btn);

    expect(setVisible).toHaveBeenCalledWith(false);
  });
});
