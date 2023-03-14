/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { CopyToClipboard } from './CopyToClipboard';

const DATA_TESTID_TOOLTIP = 'tooltip';
const DATA_TESTID_BUTTON = 'clipboard-button';

describe('CopyToClipboard ::', () => {
  test('should render the component', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <>
        <CopyToClipboard textContainer={ref} />
        <div ref={ref}>some text</div>
      </>
    );

    expect(screen.getByTestId(DATA_TESTID_BUTTON)).toBeInTheDocument();
  });

  test('clicking on the button should show the tooltip', async () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <>
        <CopyToClipboard textContainer={ref} />
        <div ref={ref}>some text</div>
      </>
    );
    const button = await screen.getByTestId(DATA_TESTID_BUTTON);

    expect(screen.queryByTestId(DATA_TESTID_TOOLTIP)).not.toBeInTheDocument();
    userEvent.click(button);

    expect(screen.queryByTestId(DATA_TESTID_TOOLTIP)).toBeInTheDocument();
  });

  test('copyToClipboard should copy the text', async () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <>
        <CopyToClipboard textContainer={ref} />
        <div ref={ref}>some text</div>
      </>
    );
    document.execCommand = jest.fn();
    const copyToClipboardSpy = jest.spyOn(document as any, 'execCommand');

    const button = await screen.getByTestId(DATA_TESTID_BUTTON);

    expect(screen.queryByTestId(DATA_TESTID_TOOLTIP)).not.toBeInTheDocument();
    userEvent.click(button);

    expect(screen.queryByTestId(DATA_TESTID_TOOLTIP)).toBeInTheDocument();

    expect(copyToClipboardSpy).toHaveBeenCalledWith('copy');
  });

  test('tooltip is automatically hidden after 2000 ms', async () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <>
        <CopyToClipboard textContainer={ref} />
        <div ref={ref}>some text</div>
      </>
    );
    const button = await screen.getByTestId(DATA_TESTID_BUTTON);

    expect(screen.queryByTestId(DATA_TESTID_TOOLTIP)).not.toBeInTheDocument();
    userEvent.click(button);

    expect(screen.queryByTestId(DATA_TESTID_TOOLTIP)).toBeInTheDocument();
  }, 2000);
});
