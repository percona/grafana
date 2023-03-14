import { render, screen } from '@testing-library/react';
import React from 'react';

import { TableToolbar } from './TableToolbar';

describe('TableToolbar::', () => {
  it('should render an input element of type number and two buttons - v1', async () => {
    render(
      <TableToolbar
        actions={[
          { callback: jest.fn(), label: 'test1', icon: 'plusSquare' },
          { callback: jest.fn(), label: 'test2', icon: 'plusSquare', isBulkAction: true },
        ]}
        selectedItems={[]}
      />
    );

    const buttons = await screen.getAllByRole('button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveProperty('disabled', false);
    expect(buttons[1]).toHaveProperty('disabled', true);
  });

  it('should render an input element of type number and two buttons - v2', async () => {
    render(
      <TableToolbar
        actions={[
          { callback: jest.fn(), label: 'test1', icon: 'plusSquare' },
          { callback: jest.fn(), label: 'test2', icon: 'plusSquare', isBulkAction: true },
        ]}
        selectedItems={['a']}
      />
    );

    const buttons = await screen.getAllByRole('button');

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveProperty('disabled', false);
    expect(buttons[1]).toHaveProperty('disabled', true);
  });

  it('should render an input element of type number and two buttons - v3', async () => {
    render(
      <TableToolbar
        actions={[
          { callback: jest.fn(), label: 'test1', icon: 'plusSquare' },
          { callback: jest.fn(), label: 'test2', icon: 'plusSquare', isBulkAction: true },
        ]}
        selectedItems={['a', 'b']}
      />
    );

    const buttons = await screen.getAllByRole('button');

    expect(buttons[0]).toHaveProperty('disabled', false);
    expect(buttons[1]).toHaveProperty('disabled', false);
  });
});
