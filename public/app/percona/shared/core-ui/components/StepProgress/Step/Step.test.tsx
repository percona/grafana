import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { Step, StepStatus } from './Step';

describe('Step::', () => {
  it('renders the step header correctly with title and number', async () => {
    render(
      <Step title="Test title" number={2} onClick={() => {}}>
        Test content
      </Step>
    );

    const header = await screen.getByTestId('step-header');
    const inner = header.querySelectorAll('div');

    expect(inner[0]).toHaveTextContent('2');
    expect(inner[1]).toHaveTextContent('Test title');
  });

  it('renders the step header correctly without title and number', async () => {
    render(<Step onClick={() => {}}>Test content</Step>);

    const header = await screen.getByTestId('step-header');
    const inner = header.querySelectorAll('div');

    expect(inner[0]).toBeEmptyDOMElement();
    expect(inner[1]).toBeEmptyDOMElement();
  });

  it('renders a checkmark when the step is done', async () => {
    render(
      <Step status={StepStatus.done} onClick={jest.fn()}>
        Test content
      </Step>
    );

    const header = await screen.getByTestId('step-header');

    expect(header.querySelector('svg')).toBeInTheDocument();
  });

  it('renders step content correctly', async () => {
    render(<Step onClick={jest.fn()}>Test content</Step>);

    expect(await screen.getByText('Test content')).toBeInTheDocument();
  });

  it('calls the step action', async () => {
    const action = jest.fn();

    render(<Step onClick={action}>Test content</Step>);

    const header = await screen.getByTestId('step-header');

    fireEvent.click(header);

    expect(action).toHaveBeenCalledTimes(1);
  });
});
