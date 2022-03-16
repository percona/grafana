import React from 'react';
import { activeCheckStub } from 'app/percona/check/__mocks__/stubs';
import { TableBody } from './TableBody';
import { render } from '@testing-library/react';

describe('TableBody::', () => {
  it('renders a table body', () => {
    const { container } = render(<TableBody data={activeCheckStub} />);

    expect(container.querySelectorAll('tbody > tr')).toHaveLength(5);
  });

  it('should render a specific text in the first row/col', () => {
    const { container } = render(<TableBody data={activeCheckStub} />);

    expect(container.querySelectorAll('tbody > tr>td')[0]).toHaveTextContent('sandbox-mysql.acme.com');
  });
});
