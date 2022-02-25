import React from 'react';
import { dataTestId } from '@percona/platform-core';
import { AlertRuleTemplateActions } from './AlertRuleTemplateActions';
import { formattedTemplateStubs } from '../__mocks__/alertRuleTemplateStubs';
import { fireEvent, render, screen } from '@testing-library/react';

describe('AlertRuleTemplateActions', () => {
  it('should render component correctly', () => {
    render(<AlertRuleTemplateActions template={formattedTemplateStubs[0]} getAlertRuleTemplates={jest.fn()} />);

    expect(screen.queryByTestId(dataTestId('alert-rule-template-edit-button'))).toBeFalsy();
    expect(screen.getByTestId('edit-template-button')).toBeTruthy();
  });

  it('should open edit modal when clicking edit button', () => {
    render(<AlertRuleTemplateActions template={formattedTemplateStubs[1]} getAlertRuleTemplates={jest.fn()} />);
    const button = screen.getByTestId('edit-template-button');
    fireEvent.click(button);
    expect(screen.findByTestId('alert-rule-template-edit-button')).toBeTruthy();
  });

  it('should open delete modal when clicking delete button', () => {
    render(<AlertRuleTemplateActions template={formattedTemplateStubs[1]} getAlertRuleTemplates={jest.fn()} />);

    const button = screen.getByTestId('delete-template-button');
    fireEvent.click(button);

    expect(screen.findByTestId('confirm-delete-modal-button')).toBeTruthy();
  });

  it('should disable edit and delete buttons when template is built-in', () => {
    render(<AlertRuleTemplateActions template={formattedTemplateStubs[0]} getAlertRuleTemplates={jest.fn()} />);

    const editButton = screen.getByTestId('edit-template-button');
    const deleteButton = screen.getByTestId('delete-template-button');

    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('should disable edit and delete buttons when template is from a file', () => {
    render(<AlertRuleTemplateActions template={formattedTemplateStubs[2]} getAlertRuleTemplates={jest.fn()} />);

    const editButton = screen.getByTestId('edit-template-button');
    const deleteButton = screen.getByTestId('delete-template-button');

    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('should disable edit and delete buttons when Portal is the template source', () => {
    render(<AlertRuleTemplateActions template={formattedTemplateStubs[4]} getAlertRuleTemplates={jest.fn()} />);

    const editButton = screen.getByTestId('edit-template-button');
    const deleteButton = screen.getByTestId('delete-template-button');

    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});
