import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { FormWrapper } from '../../shared';

import { ChipAreaInputField } from './ChipAreaInputField';

const insertTags = (tags: string[]) => {
  fireEvent.click(screen.getByTestId('chips-container'));

  for (let i = 0; i < tags.length; i += 1) {
    fireEvent.change(screen.getByPlaceholderText('tags'), { target: { value: tags[i] } });
    fireEvent.keyDown(screen.getByPlaceholderText('tags'), { key: 'Enter' });
  }
};

describe('ChipAreaInputField::', () => {
  it('should set initial chips', () => {
    render(
      <FormWrapper>
        <ChipAreaInputField name="chips" initialChips={['chip1', 'chip2']} />
      </FormWrapper>
    );

    expect(screen.getAllByTestId('chip')).toHaveLength(2);
  });

  it('should focus input when clicking container', () => {
    render(
      <FormWrapper>
        <ChipAreaInputField name="chips" placeholder="tags" />
      </FormWrapper>
    );

    fireEvent.click(screen.getByTestId('chips-container'));
    expect(document.activeElement).toEqual(screen.getByPlaceholderText('tags'));
  });

  it('should add tag after clicking Enter', () => {
    render(
      <FormWrapper>
        <ChipAreaInputField name="chips" placeholder="tags" />
      </FormWrapper>
    );

    insertTags(['Tag1']);

    expect(screen.getAllByTestId('chip')).toHaveLength(1);
    expect(screen.getAllByTestId('chip')[0].textContent).toBe('Tag1');

    insertTags(['Tag2']);

    expect(screen.getAllByTestId('chip')).toHaveLength(2);
    expect(screen.getAllByTestId('chip')[1]).toHaveTextContent('Tag2');
  });

  it('should clear input after adding tag', () => {
    render(
      <FormWrapper>
        <ChipAreaInputField name="chips" placeholder="tags" />
      </FormWrapper>
    );

    insertTags(['Tag1']);

    expect(screen.getByPlaceholderText('tags').getAttribute('value')).toBe('');
  });

  it('should not allow empty tags', () => {
    render(
      <FormWrapper>
        <ChipAreaInputField name="chips" placeholder="tags" />
      </FormWrapper>
    );

    insertTags(['']);

    expect(screen.queryAllByTestId('chip')).toHaveLength(0);
  });

  it('should not allow duplicate tags', () => {
    render(
      <FormWrapper>
        <ChipAreaInputField name="chips" placeholder="tags" />
      </FormWrapper>
    );

    insertTags(['Tag1', 'Tag2', 'Tag1']);

    expect(screen.queryAllByTestId('chip')).toHaveLength(2);
  });

  it('should remove a tag when backspace is pressed and there is no input', () => {
    render(
      <FormWrapper>
        <ChipAreaInputField name="chips" placeholder="tags" />
      </FormWrapper>
    );

    insertTags(['Tag1', 'Tag2', 'Tag3']);
    fireEvent.keyDown(screen.getByPlaceholderText('tags'), { key: 'Backspace' });

    expect(screen.queryAllByTestId('chip')).toHaveLength(2);
    expect(screen.queryAllByTestId('chip')[0]).toHaveTextContent('Tag1');
    expect(screen.queryAllByTestId('chip')[1]).toHaveTextContent('Tag2');
  });

  it('should not remove any tag when backspace is pressed and there is input', () => {
    render(
      <FormWrapper>
        <ChipAreaInputField name="chips" placeholder="tags" />
      </FormWrapper>
    );

    insertTags(['Tag1', 'Tag2', 'Tag3']);
    fireEvent.change(screen.getByPlaceholderText('tags'), { target: { value: 'F' } });
    fireEvent.keyDown(screen.getByPlaceholderText('tags'), { key: 'Backspace' });

    expect(screen.queryAllByTestId('chip')).toHaveLength(3);
  });

  it('should remove tags', () => {
    render(
      <FormWrapper>
        <ChipAreaInputField name="chips" placeholder="tags" />
      </FormWrapper>
    );

    insertTags(['Tag1', 'Tag2', 'Tag3']);
    fireEvent.click(screen.getAllByTestId('chip')[1].getElementsByTagName('svg')[0]);

    expect(screen.queryAllByTestId('chip')).toHaveLength(2);
    expect(screen.queryAllByTestId('chip')[0]).toHaveTextContent('Tag1');
    expect(screen.queryAllByTestId('chip')[1]).toHaveTextContent('Tag3');
  });

  it('should show validation errors on render if specified', async () => {
    const validatorOne = jest.fn();
    const validatorTwo = jest.fn().mockReturnValue('some error');

    render(
      <FormWrapper>
        <ChipAreaInputField showErrorOnRender name="test" validators={[validatorOne, validatorTwo]} />
      </FormWrapper>
    );

    expect(validatorOne).toBeCalledTimes(1);
    expect(validatorTwo).toBeCalledTimes(1);

    expect(await screen.queryByText('some error')).toBeInTheDocument();
  });
});
