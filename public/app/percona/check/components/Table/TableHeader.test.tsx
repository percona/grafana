import React from 'react';
import { COLUMNS } from 'app/percona/check/CheckPanel.constants';
import { TableHeader } from './TableHeader';
import { render } from '@testing-library/react';

describe('TableHeader::', () => {
  it('should render a colgroup with 3 columns', () => {
    const { container } = render(<TableHeader columns={COLUMNS} />);

    expect(container.querySelectorAll('colgroup > col')).toHaveLength(5);
    // Check if there widths in styles
    expect(container.querySelectorAll('colgroup > col')[1]).toHaveProperty(
      'style',
      expect.objectContaining({
        minWidth: '200px',
        width: '200px',
      })
    );
  });

  it('should render 3 column headers', () => {
    const { container } = render(<TableHeader columns={COLUMNS} />);

    expect(container.querySelectorAll('thead > tr > th')).toHaveLength(5);
    // Check the header of the first column
    expect(container.querySelectorAll('th')[0].textContent).toEqual('Service name');
  });
});
