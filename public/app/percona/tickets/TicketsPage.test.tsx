import React from 'react';
import { render, screen } from '@testing-library/react';
import TicketsPage from './TicketsPage';

describe('TicketsPage', () => {
  it('renders PageWrapper', async () => {
    await render(<TicketsPage />);
    expect(screen.queryByText('Tickets')).toBeInTheDocument();
  });
});
