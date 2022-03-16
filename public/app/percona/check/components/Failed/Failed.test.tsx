import React from 'react';
import { Tooltip } from '@grafana/ui';
import { Failed } from './Failed';
import { render, screen } from '@testing-library/react';

jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  Tooltip: jest.fn(({ children }) => <div data-testid="tooltip">{children}</div>),
}));

describe('Failed::', () => {
  it('should render a sum of total failed checks with severity details', async () => {
    const { container } = render(<Failed failed={[1, 0, 1]} />);

    expect(container.querySelectorAll('div > span')[0].textContent).toEqual('2 (1 / 0 / 1)');
  });

  it('should render inner components', () => {
    render(<Failed failed={[1, 0, 1]} />);

    expect(screen.getByTestId('failed-info-icon')).toBeInTheDocument();
    expect(Tooltip).toHaveBeenCalled();
  });
});
