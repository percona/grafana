import { fireEvent, render, screen } from '@testing-library/react';
import { LoaderButton } from 'components/LoaderButton';
import { TextInputField } from 'components/TextInput';
import { TextareaInputField } from 'components/TextareaInput';
import React from 'react';

import { StepProgress } from './StepProgress';

describe('StepProgress::', () => {
  const steps = [
    {
      render: () => (
        <div>
          <TextInputField name="name" />
          <TextInputField name="email" />
        </div>
      ),
      fields: ['name', 'email'],
      dataQa: 'step-1',
    },
    {
      render: () => (
        <div>
          <TextareaInputField name="description" />
          <LoaderButton type="submit" />
        </div>
      ),
      fields: ['description'],
      dataQa: 'step-2',
    },
  ];

  const isCurrentStep = (wrapper: HTMLElement, dataQa: string) => {
    const className = wrapper
      .querySelector(`[data-testid="${dataQa}"]`)
      .querySelectorAll('[data-testid="step-content"] > div')[0]
      .getAttribute('class');

    return /current$/i.test(className);
  };

  it('renders steps correctly', async () => {
    const { container } = render(<StepProgress steps={steps} onSubmit={jest.fn()} />);

    // the component renders two inputs and one textarea, all of which have the role `textbox`
    expect(await screen.getAllByRole('textbox')).toHaveLength(3);
    expect(await screen.getAllByRole('button')).toHaveLength(1);
    expect(await screen.getAllByTestId('step-header')).toHaveLength(2);

    expect(isCurrentStep(container, 'step-1')).toBeTruthy();
  });

  it('renders steps correctly with initial values', () => {
    render(
      <StepProgress
        steps={steps}
        onSubmit={jest.fn()}
        initialValues={{
          name: 'Test name',
          description: 'Test description',
        }}
      />
    );

    expect(screen.getByDisplayValue('Test name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
  });

  it('changes the current step on header click', async () => {
    const { container } = render(<StepProgress steps={steps} onSubmit={jest.fn()} />);

    expect(isCurrentStep(container, 'step-1')).toBeTruthy();

    const stepHeader = await screen.getByTestId('step-2').querySelector('[data-testid="step-header"]');

    fireEvent.click(stepHeader);

    expect(isCurrentStep(container, 'step-1')).toBeFalsy();
    expect(isCurrentStep(container, 'step-2')).toBeTruthy();
  });

  it('submits the form on submit', async () => {
    const onSubmit = jest.fn();

    render(
      <StepProgress
        steps={steps}
        onSubmit={onSubmit}
        initialValues={{
          name: 'Test name',
          description: 'Test description',
        }}
      />
    );

    const input = await screen.getAllByRole('textbox')[1];
    const form = await screen.getByTestId('step-progress');

    fireEvent.change(input, { target: { value: 'test@test.com' } });
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
