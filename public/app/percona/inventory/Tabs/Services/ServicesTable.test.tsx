import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import { Databases } from 'app/percona/shared/core';
import { ServiceStatus } from 'app/percona/shared/services/services/Services.types';

import { Messages } from '../../Inventory.messages';
import { FlattenService } from '../../Inventory.types';
import { ADDRESS_DOCS_LINK, Messages as AddressMessages } from '../../components/AddressInfo/AddressInfo.messages';

import ServicesTable from './ServicesTable';

const services: FlattenService[] = [
  {
    serviceId: 'service-1',
    serviceName: 'mysql-svc',
    nodeId: 'node-1',
    nodeName: 'db-host',
    status: ServiceStatus.UP,
    address: '127.0.0.1',
    port: 3306,
    type: Databases.mysql,
    agentsStatus: 'OK',
  },
];

const renderTable = () =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ServicesTable isLoading={false} flattenServices={services} onSelectionChange={jest.fn()} onDelete={jest.fn()} />
    </MemoryRouter>
  );

const getAddressInfoIcon = () => {
  const header = screen.getByRole('columnheader', { name: new RegExp(Messages.services.columns.address) });
  return within(header).getByTestId('icon-info-circle');
};

describe('ServicesTable', () => {
  it('shows an info icon next to the Address header', () => {
    renderTable();

    expect(getAddressInfoIcon()).toBeInTheDocument();
  });

  it('explains the address with a docs link when hovering the icon', async () => {
    renderTable();

    await userEvent.hover(getAddressInfoIcon());

    const tooltip = await screen.findByRole('tooltip');
    expect(within(tooltip).getByText(AddressMessages.description, { exact: false })).toBeInTheDocument();
    expect(within(tooltip).getByRole('link', { name: new RegExp(AddressMessages.learnMore) })).toHaveAttribute(
      'href',
      ADDRESS_DOCS_LINK
    );
  });

  it('explains the address when the icon receives keyboard focus', async () => {
    renderTable();

    act(() => getAddressInfoIcon().focus());

    const tooltip = await screen.findByRole('tooltip');
    expect(within(tooltip).getByText(AddressMessages.description, { exact: false })).toBeInTheDocument();
  });
});
