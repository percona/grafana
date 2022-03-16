import React from 'react';
import { activeCheckStub } from 'app/percona/check/__mocks__/stubs';
import { TableDataAlertDetails } from 'app/percona/check/components/Table';
import { SEVERITY } from 'app/percona/check/CheckPanel.constants';
import { Messages } from '../../CheckPanel.messages';
import { Severity } from '../../types';
import { render, screen } from '@testing-library/react';

describe('TableDataAlertDetails::', () => {
  it('should correctly render the severity level', () => {
    const detailsItem = activeCheckStub[0].details[0];

    const { container } = render(<TableDataAlertDetails detailsItem={detailsItem} />);
    expect(container.querySelectorAll('td')[0].textContent).toEqual(SEVERITY[detailsItem.labels.severity as Severity]);
  });

  it('should correctly render the description', () => {
    const detailsItem = activeCheckStub[0].details[0];

    const { container } = render(<TableDataAlertDetails detailsItem={detailsItem} />);

    expect(container.querySelectorAll('td')[1].textContent).toEqual(
      `${detailsItem.description} - ${Messages.readMore}`
    );
  });

  it('should show a silence alert button', () => {
    const detailsItem = activeCheckStub[0].details[0];

    render(<TableDataAlertDetails detailsItem={detailsItem} />);
    expect(screen.getAllByTestId('silence-loader-button')).toHaveLength(1);
  });

  it('shows a text for silenced alerts', () => {
    const detailsItem = activeCheckStub[3].details[0];

    const { container } = render(<TableDataAlertDetails detailsItem={detailsItem} />);

    expect(screen.queryByTestId('silence-loader-button')).not.toBeInTheDocument();
    expect(container.querySelectorAll('td')[2].textContent).toEqual(Messages.silenced);
  });
});
