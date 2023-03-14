import { render, screen } from '@testing-library/react';
import React from 'react';

import { TableToolbarButton } from './TableToolbarButton';

describe('TableToolbarButton::', () => {
  it('should render a button with an icon and text', () => {
    const { container } = render(<TableToolbarButton icon="plusSquare" label="test" />);

    expect(screen.getByRole('button')).toHaveTextContent('test');
    expect(container.querySelector('svg')).toHaveAttribute('name', 'plusSquare');
  });
});
