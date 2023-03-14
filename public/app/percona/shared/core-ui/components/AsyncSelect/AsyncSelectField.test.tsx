import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';

import { generateOptions } from '../../__mocks__/mockAsyncSelectOptions';
import { FormWrapper, validators } from '../../shared';

import { AsyncSelectField } from './AsyncSelectField';

const { email, minLength } = validators;

describe('AsyncSelectField::', () => {
  const getOptions = (timeout = 10): jest.Mock =>
    jest.fn().mockReturnValue(new Promise((resolve) => setTimeout(() => resolve(generateOptions()), timeout)));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should render a field container with input', async () => {
    const { container } = render(
      <FormWrapper>
        <AsyncSelectField name="test" />
      </FormWrapper>
    );

    expect(screen.getByTestId('test-field-container'));
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('should render a label', () => {
    render(
      <FormWrapper>
        <AsyncSelectField name="test" label="test label" />
      </FormWrapper>
    );

    expect(screen.getByTestId('test-field-label')).toBeInTheDocument();
    expect(screen.getByTestId('test-field-label')).toHaveTextContent('test label');
  });

  it('should show the loader', async () => {
    render(
      <FormWrapper>
        <AsyncSelectField defaultOptions name="test" label="test label" loadOptions={getOptions()} isOpen />
      </FormWrapper>
    );

    expect(screen.getByTestId('test-field-container').children[1]).toHaveTextContent('Loading options...');

    await waitFor(() => {
      expect(screen.getAllByLabelText('Select option')).toHaveLength(4);
    });
  });

  it('should react on multiple validators', async () => {
    render(
      <FormWrapper>
        <AsyncSelectField
          defaultOptions
          name="test"
          label="test-label"
          validators={[email, minLength(13)]}
          loadOptions={getOptions()}
          isOpen
        />
      </FormWrapper>
    );

    const menuOptions = await waitFor(() => screen.getAllByLabelText('Select option'));

    fireEvent.click(menuOptions[0]);
    expect(screen.getByTestId('test-field-error-message')).toHaveTextContent('Must contain at least 13 characters');

    fireEvent.click(menuOptions[1]);
    expect(screen.getByTestId('test-field-error-message')).toHaveTextContent('Invalid email address');

    fireEvent.click(menuOptions[2]);
    expect(screen.getByTestId('test-field-error-message')).toHaveTextContent('');
  });

  it('should show an error below the input', async () => {
    render(
      <FormWrapper>
        <AsyncSelectField
          defaultOptions
          name="test"
          label="test-label"
          validators={[minLength(13)]}
          loadOptions={getOptions()}
          isOpen
        />
      </FormWrapper>
    );

    const menuOptions = await waitFor(() => screen.getAllByLabelText('Select option'));

    fireEvent.click(menuOptions[0]);
    expect(screen.getByTestId('test-field-error-message')).toHaveTextContent('Must contain at least 13 characters');
  });
});
