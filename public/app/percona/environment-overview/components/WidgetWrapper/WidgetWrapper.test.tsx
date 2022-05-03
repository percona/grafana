import { render, screen } from '@testing-library/react';
import React from 'react';
import { WidgetWrapper } from './WidgetWrapper';

describe('WidgetWrapper', () => {
  it('render children when request is not pending', () => {
    const Dummy = () => <span data-testid="dummy"></span>;
    render(
      <WidgetWrapper title="Title" isPending={false}>
        <Dummy />
      </WidgetWrapper>
    );

    expect(screen.getByTestId('dummy')).toBeInTheDocument();
  });

  it('not render children when request is pending', () => {
    const Dummy = () => <span data-testid="dummy"></span>;
    render(
      <WidgetWrapper title="Title" isPending={true}>
        <Dummy />
      </WidgetWrapper>
    );

    expect(screen.queryByTestId('dummy')).not.toBeInTheDocument();
  });
});
