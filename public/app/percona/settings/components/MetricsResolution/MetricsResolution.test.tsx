import React from 'react';
import { MetricsResolution } from './MetricsResolution';
import { defaultResolutions } from './MetricsResolution.constants';
import { removeUnits } from './MetricsResolution.utils';
import { fireEvent, render, screen } from '@testing-library/react';

describe('MetricsResolution::', () => {
  it('Renders correctly with props for standard resolution', () => {
    render(<MetricsResolution />);

    const standardRes = removeUnits(defaultResolutions[1]);

    expect(screen.getByTestId('lr-number-input')).toHaveValue(+standardRes.lr);
    expect(screen.getByTestId('mr-number-input')).toHaveValue(+standardRes.mr);
    expect(screen.getByTestId('hr-number-input')).toHaveValue(+standardRes.hr);
  });

  it('Renders correctly with props for rare resolution', () => {
    render(<MetricsResolution />);

    const standardRes = removeUnits(defaultResolutions[0]);

    expect(screen.getByTestId('lr-number-input')).toHaveValue(+standardRes.lr);
    expect(screen.getByTestId('mr-number-input')).toHaveValue(+standardRes.mr);
    expect(screen.getByTestId('hr-number-input')).toHaveValue(+standardRes.hr);
  });

  it('Renders correctly with props for frequent resolution', () => {
    render(<MetricsResolution />);

    const standardRes = removeUnits(defaultResolutions[2]);

    expect(screen.getByTestId('lr-number-input')).toHaveValue(+standardRes.lr);
    expect(screen.getByTestId('mr-number-input')).toHaveValue(+standardRes.mr);
    expect(screen.getByTestId('hr-number-input')).toHaveValue(+standardRes.hr);
  });

  it('Renders correctly with props for custom resolution', () => {
    render(<MetricsResolution />);

    expect(screen.getByTestId('lr-number-input')).toHaveValue(400);
    expect(screen.getByTestId('mr-number-input')).toHaveValue(100);
    expect(screen.getByTestId('hr-number-input')).toHaveValue(50);
  });

  it('Changes input values when changing resolution', () => {
    render(<MetricsResolution />);
    const radio = screen.getAllByTestId('resolutions-radio-button')[2];

    fireEvent.click(radio);

    const standardRes = removeUnits(defaultResolutions[2]);

    expect(screen.getByTestId('lr-number-input')).toHaveValue(+standardRes.lr);
    expect(screen.getByTestId('mr-number-input')).toHaveValue(+standardRes.mr);
    expect(screen.getByTestId('hr-number-input')).toHaveValue(+standardRes.hr);
  });

  it('Disables apply changes on initial values', () => {
    render(<MetricsResolution />);
    const button = screen.getByTestId('metrics-resolution-button');

    expect(button).toBeDisabled();
  });

  it('Calls apply changes', () => {
    const updateSettings = jest.fn();
    render(<MetricsResolution />);

    const input = screen.getByTestId('lr-number-input');
    fireEvent.change(input, { target: { value: '70' } });

    const form = screen.getByTestId('metrics-resolution-form');
    fireEvent.submit(form);

    expect(updateSettings).toHaveBeenCalled();
  });
});
