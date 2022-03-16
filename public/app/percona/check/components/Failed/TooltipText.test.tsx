import React from 'react';
import { TooltipText } from './TooltipText';
import { render } from '@testing-library/react';

describe('TooltipText::', () => {
  it('should render a header with a sum of failed checks', () => {
    const { container } = render(<TooltipText sum={5} data={[1, 3, 1]} />);

    expect(container.querySelectorAll('div > div')[0]).toHaveTextContent('Failed checks: 5');
  });

  it('should render a body with failed checks detailed by severity', () => {
    const { container } = render(<TooltipText sum={5} data={[1, 3, 1]} />);
    const root = container.querySelectorAll('div > div > div> div');

    expect(root[0]).toHaveTextContent('Critical – 1');
    expect(root[1]).toHaveTextContent('Major – 3');
    expect(root[2]).toHaveTextContent('Trivial – 1');
  });

  it('should render nothing when the sum is zero', () => {
    const { container } = render(<TooltipText sum={0} data={[0, 0, 0]} />);
    const root = container.querySelectorAll('div');

    expect(root).toHaveLength(0);
  });
});
