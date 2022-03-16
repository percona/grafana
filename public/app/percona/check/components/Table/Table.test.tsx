import React from 'react';
import { COLUMNS } from 'app/percona/check/CheckPanel.constants';
import { activeCheckStub } from 'app/percona/check/__mocks__/stubs';
import { Table } from 'app/percona/check/components/Table';
import { render, screen } from '@testing-library/react';

describe('Table::', () => {
  it('should display a custom message if STT is enabled and data is empty', () => {
    render(<Table columns={COLUMNS} data={[]} />);

    const emptyDiv = screen.getAllByTestId('db-check-panel-table-empty');

    expect(emptyDiv).toHaveLength(1);
    expect(emptyDiv[0]).toHaveTextContent('No failed checks.');
  });

  it('should render the table with a header and a body if STT is enabled and data is not empty', () => {
    render(<Table columns={COLUMNS} data={activeCheckStub} />);

    const table = screen.getAllByTestId('db-check-panel-table');

    expect(table).toHaveLength(1);
    expect(table[0].querySelectorAll('thead')).toHaveLength(1);
    expect(table[0].querySelectorAll('tbody')).toHaveLength(1);
  });
});
