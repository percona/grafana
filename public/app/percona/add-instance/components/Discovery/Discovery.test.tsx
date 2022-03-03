import React from 'react';
import Discovery from './Discovery';
import { render, screen, waitFor } from '@testing-library/react';

describe('Discovery:: ', () => {
  //TODO warning: "An update to Discovery inside a test was not wrapped in act(...)."
  it('should render credentials, instances and docs', async () => {
    await waitFor(() => render(<Discovery selectInstance={jest.fn()} />));

    expect(screen.getByTestId('credentials-form')).toBeInTheDocument();
    expect(screen.getByTestId('instances-table-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('discovery-docs')).toBeInTheDocument();
  });
});
