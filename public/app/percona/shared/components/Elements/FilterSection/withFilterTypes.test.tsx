import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { withFilterTypes } from './withFilterTypes';
import { RadioButtonGroupField, TextInputField } from '@percona/platform-core';

interface FormValues {
  name: string;
  status: string;
}

describe('withFilterTypes', () => {
  it('should be collapsed if isOpen is not passed', () => {
    const Filters = withFilterTypes<FormValues>({ name: '', status: 'foo' });

    render(
      <Filters onApply={jest.fn()}>
        <TextInputField name="name" label="Name" />
        <RadioButtonGroupField
          options={[
            { label: 'Foo', value: 'foo' },
            { label: 'Bar', value: 'bar' },
          ]}
          name="status"
          label="Status"
        />
      </Filters>
    );

    expect(screen.queryByTestId('name-text-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('status-radio-state')).not.toBeInTheDocument();
  });

  it('should render form fields when open', () => {
    const Filters = withFilterTypes<FormValues>({ name: '', status: 'foo' });

    render(
      <Filters isOpen onApply={jest.fn()}>
        <TextInputField name="name" label="Name" />
        <RadioButtonGroupField
          options={[
            { label: 'Foo', value: 'foo' },
            { label: 'Bar', value: 'bar' },
          ]}
          name="status"
          label="Status"
        />
      </Filters>
    );

    expect(screen.getByTestId('name-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('status-radio-state')).toBeInTheDocument();
  });

  it('should attach class names to form', () => {
    const Filters = withFilterTypes<FormValues>({ name: '', status: 'foo' });

    render(<Filters isOpen className="foo-class" onApply={jest.fn()}></Filters>);

    expect(screen.getByRole('form')).toHaveClass('foo-class');
  });

  it('should call onApply with form values', () => {
    const Filters = withFilterTypes<{ name: string; surname: string }>({ name: '', surname: '' });
    const onApply = jest.fn();

    render(
      <Filters isOpen onApply={onApply}>
        <TextInputField name="name" label="Name" />
        <TextInputField name="surname" label="Surname" />
      </Filters>
    );

    fireEvent.input(screen.getByTestId('name-text-input'), { target: { value: 'John' } });
    fireEvent.input(screen.getByTestId('surname-text-input'), { target: { value: 'Doe' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onApply).toHaveBeenCalledWith({ name: 'John', surname: 'Doe' }, expect.anything(), expect.anything());
  });

  it('should render initial values', () => {
    const Filters = withFilterTypes<FormValues>({ name: '', status: 'foo' }, { name: 'john', status: 'foo' });
    const onApply = jest.fn();

    render(
      <Filters isOpen onApply={onApply}>
        <TextInputField name="name" label="Name" />
        <RadioButtonGroupField
          options={[
            { label: 'Foo', value: 'foo' },
            { label: 'Bar', value: 'bar' },
          ]}
          name="status"
          label="Status"
        />
      </Filters>
    );

    fireEvent.input(screen.getByTestId('name-text-input'), { target: { value: 'John' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onApply).toHaveBeenCalledWith({ name: 'John', status: 'foo' }, expect.anything(), expect.anything());
  });

  it('should clear values', () => {
    const Filters = withFilterTypes<FormValues>({ name: '', status: 'bar' }, { name: 'john', status: 'foo' });
    const onClear = jest.fn();

    render(
      <Filters isOpen onApply={jest.fn()} onClear={onClear}>
        <TextInputField name="name" label="Name" />
        <RadioButtonGroupField
          options={[
            { label: 'Foo', value: 'foo' },
            { label: 'Bar', value: 'bar' },
          ]}
          name="status"
          label="Status"
        />
      </Filters>
    );

    fireEvent.input(screen.getByTestId('name-text-input'), { target: { value: 'John' } });
    fireEvent.click(screen.getByTestId('clear-filters-button'));
    expect(screen.getByTestId<HTMLInputElement>('name-text-input').value).toBe('');
    expect(screen.getByTestId<HTMLInputElement>('status-radio-state').value).toBe('bar');
    expect(onClear).toHaveBeenCalled();
  });

  it('should hide "onApply"', () => {
    const Filters = withFilterTypes<FormValues>({ name: '', status: 'bar' }, { name: 'john', status: 'foo' });
    render(
      <Filters isOpen showApply={false} onApply={jest.fn()}>
        <TextInputField name="name" label="Name" />
        <RadioButtonGroupField
          options={[
            { label: 'Foo', value: 'foo' },
            { label: 'Bar', value: 'bar' },
          ]}
          name="status"
          label="Status"
        />
      </Filters>
    );

    expect(screen.queryByTestId('apply-filters-button')).not.toBeInTheDocument();
  });
});
