import { render, screen } from '@testing-library/react';
import React from 'react';

import { TableContent } from './TableContent';

describe('TableContent', () => {
  it('should display the noData section when no data is passed', async () => {
    render(<TableContent hasData={false} emptyMessage="empty" />);
    const noData = await screen.findByTestId('table-no-data');

    expect(noData).toBeInTheDocument();
    expect(noData).toHaveTextContent('empty');
  });

  it('should not display the noData section when no data is passed and it is still loading', () => {
    render(<TableContent loading hasData={false} emptyMessage="empty" />);
    const noData = screen.queryByTestId('table-no-data');

    expect(noData).toBeInTheDocument();
    expect(noData).toHaveTextContent('');
  });

  it('should display the table when there is data', () => {
    render(
      <TableContent hasData emptyMessage="no data">
        <span data-testid="dummy" />
      </TableContent>
    );

    expect(screen.queryByTestId('table-no-data')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dummy')).toBeInTheDocument();
  });
});
