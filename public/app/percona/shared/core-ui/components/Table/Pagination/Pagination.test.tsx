import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { SelectableValue } from '@grafana/data';

import { Pagination } from './Pagination';
import { Messages } from './Pagination.messages';

describe('Pagination', () => {
  it('should render at least one page', async () => {
    render(<Pagination totalItems={0} pageCount={1} pageSizeOptions={[]} pageSize={3} nrRowsOnCurrentPage={0} />);

    expect(screen.queryByTestId('page-button')).toBeInTheDocument();
    expect(await screen.findByTestId('page-button')).toBeEnabled();
  });

  it('should disable left navigation buttons when in first page', async () => {
    render(<Pagination totalItems={30} pageCount={10} pageSizeOptions={[]} pageSize={3} nrRowsOnCurrentPage={3} />);

    expect(await screen.findByTestId('previous-page-button')).toBeDisabled();
    expect(await screen.findByTestId('first-page-button')).toBeDisabled();
  });

  it('should disable right navigation buttons when in last page', async () => {
    render(<Pagination totalItems={10} pageCount={1} pageSizeOptions={[]} pageSize={10} nrRowsOnCurrentPage={10} />);

    expect(await screen.findByTestId('next-page-button')).toBeDisabled();
    expect(await screen.findByTestId('last-page-button')).toBeDisabled();
  });

  it('should enable all navigation buttons while active page is not first or last', async () => {
    render(<Pagination totalItems={30} pageCount={3} pageSizeOptions={[]} pageSize={10} nrRowsOnCurrentPage={10} />);

    userEvent.click(await screen.findByTestId('next-page-button'));
    expect(await screen.findByTestId('previous-page-button')).toBeEnabled();
    expect(await screen.findByTestId('first-page-button')).toBeEnabled();
    expect(await screen.findByTestId('next-page-button')).toBeEnabled();
    expect(await screen.findByTestId('last-page-button')).toBeEnabled();
  });

  it('should show all pages when pagesPerView > totalPages', async () => {
    render(
      <Pagination
        pagesPerView={25}
        totalItems={10}
        pageCount={4}
        pageSizeOptions={[]}
        pageSize={3}
        nrRowsOnCurrentPage={3}
      />
    );

    expect(await screen.findAllByTestId('page-button')).toHaveLength(4);
  });

  it('should show "pagesPerView" pages if pageCount > pagesPerView', async () => {
    render(
      <Pagination
        pagesPerView={5}
        totalItems={100}
        pageCount={10}
        pageSizeOptions={[]}
        pageSize={10}
        nrRowsOnCurrentPage={10}
      />
    );

    expect(await screen.findAllByTestId('page-button')).toHaveLength(5);
  });

  it('should keep the selected page in the center, when pagesPerView is odd and while last page button is not visible', () => {
    render(
      <Pagination
        pagesPerView={5}
        totalItems={20}
        pageCount={7}
        pageSizeOptions={[]}
        pageSize={3}
        nrRowsOnCurrentPage={3}
      />
    );

    // There's 7 pages, meaning two clicks will get us to page 3, in the very center
    // Two more clicks should bring 5 to the center as well
    userEvent.click(screen.getByTestId('next-page-button'));
    userEvent.click(screen.getByTestId('next-page-button'));

    expect(screen.getAllByTestId('page-button')[2]).toHaveTextContent('3');
    expect(screen.getAllByTestId('page-button')[2]).toBeEnabled();

    userEvent.click(screen.getByTestId('next-page-button'));
    userEvent.click(screen.getByTestId('next-page-button'));

    expect(screen.getAllByTestId('page-button')[2]).toHaveTextContent('5');
    expect(screen.getAllByTestId('page-button')[2]).toBeEnabled();
  });

  it('should keep the selected page in the center-left, when pagesPerView is even and while last page button is not visible', () => {
    render(
      <Pagination
        pagesPerView={6}
        totalItems={80}
        pageCount={8}
        pageSizeOptions={[]}
        pageSize={10}
        nrRowsOnCurrentPage={10}
      />
    );

    // There's 8 pages, meaning two clicks will get us to page 3, in the center-left
    // Two more clicks should bring 5 to that same position
    userEvent.click(screen.getByTestId('next-page-button'));
    userEvent.click(screen.getByTestId('next-page-button'));

    expect(screen.getAllByTestId('page-button')[2]).toHaveTextContent('3');
    expect(screen.getAllByTestId('page-button')[2]).toBeEnabled();

    userEvent.click(screen.getByTestId('next-page-button'));
    userEvent.click(screen.getByTestId('next-page-button'));

    expect(screen.getAllByTestId('page-button')[2]).toHaveTextContent('5');
    expect(screen.getAllByTestId('page-button')[2]).toBeEnabled();
  });

  it('should keep moving from the center when last page button is already visible', () => {
    render(
      <Pagination
        pagesPerView={3}
        totalItems={15}
        pageCount={5}
        pageSizeOptions={[]}
        pageSize={3}
        nrRowsOnCurrentPage={3}
      />
    );

    // There's 5 pages and 3 pages/view, meaning two clicks will bring the last page button into the view
    // eslint-disable-next-line max-len
    // After that, any click should move the active page button towards the end, instead of keeping in the center
    // That means that with 4 clicks, we should have page 5 selected on the right
    for (let i = 0; i < 4; i += 1) {
      userEvent.click(screen.getByTestId('next-page-button'));
    }

    expect(screen.getAllByTestId('page-button')[2]).toHaveTextContent('5');
    expect(screen.getAllByTestId('page-button')[2]).toBeEnabled();
  });

  it('should correctly show the items interval being shown', () => {
    render(
      <Pagination
        pagesPerView={3}
        totalItems={15}
        pageCount={5}
        pageSizeOptions={[]}
        pageSize={3}
        nrRowsOnCurrentPage={3}
      />
    );

    expect(screen.getByTestId('pagination-items-inverval')).toHaveTextContent(
      Messages.getItemsIntervalMessage(1, 3, 15)
    );

    userEvent.click(screen.getByTestId('next-page-button'));
    userEvent.click(screen.getByTestId('next-page-button'));

    expect(screen.getByTestId('pagination-items-inverval')).toHaveTextContent(
      Messages.getItemsIntervalMessage(7, 9, 15)
    );
  });

  it('should show "showing 0 - 0 of 0 items" when empty', () => {
    render(
      <Pagination
        pagesPerView={3}
        totalItems={0}
        pageCount={0}
        pageSizeOptions={[]}
        pageSize={3}
        nrRowsOnCurrentPage={0}
      />
    );

    expect(screen.getByTestId('pagination-items-inverval')).toHaveTextContent(
      Messages.getItemsIntervalMessage(0, 0, 0)
    );
  });

  it('should trigger a page change', () => {
    const cb = jest.fn();

    render(
      <Pagination
        pagesPerView={3}
        totalItems={15}
        pageCount={5}
        pageSizeOptions={[]}
        pageSize={3}
        nrRowsOnCurrentPage={3}
        onPageChange={cb}
      />
    );

    userEvent.click(screen.getByTestId('next-page-button'));
    expect(cb).toBeCalledWith(1);
  });

  it('should not trigger a page change on first page and previous is clicked', () => {
    const cb = jest.fn();

    render(
      <Pagination
        pagesPerView={3}
        totalItems={15}
        pageCount={5}
        pageSizeOptions={[]}
        pageSize={3}
        nrRowsOnCurrentPage={3}
        onPageChange={cb}
      />
    );

    userEvent.click(screen.getByTestId('previous-page-button'), {});
    expect(cb).not.toHaveBeenCalled();
  });

  it('should not trigger a page change if on last page and next is clicked', () => {
    const cb = jest.fn();

    render(
      <Pagination
        pagesPerView={3}
        totalItems={15}
        pageCount={5}
        pageSizeOptions={[]}
        pageSize={3}
        nrRowsOnCurrentPage={3}
        onPageChange={cb}
      />
    );

    for (let i = 0; i < 5; i += 1) {
      userEvent.click(screen.getByTestId('next-page-button'), {});
    }

    expect(cb).toHaveBeenCalledTimes(4);
  });

  it('should jump to last page', () => {
    render(
      <Pagination
        pagesPerView={3}
        totalItems={15}
        pageCount={5}
        pageSizeOptions={[]}
        pageSize={3}
        nrRowsOnCurrentPage={3}
      />
    );

    userEvent.click(screen.getByTestId('last-page-button'));

    const activePageButton = screen.getAllByTestId('page-button').slice(-1)[0];

    expect(activePageButton).toBeEnabled();
    expect(activePageButton).toHaveTextContent('5');
  });

  it('should jump to first page', () => {
    render(
      <Pagination
        pagesPerView={3}
        totalItems={15}
        pageCount={5}
        pageSizeOptions={[]}
        pageSize={3}
        nrRowsOnCurrentPage={3}
      />
    );

    for (let i = 0; i < 5; i += 1) {
      userEvent.click(screen.getByTestId('next-page-button'), {});
    }

    userEvent.click(screen.getByTestId('first-page-button'));

    const activePageButton = screen.getAllByTestId('page-button')[0];

    expect(activePageButton).toBeEnabled();
    expect(activePageButton).toHaveTextContent('1');
  });

  it('should go to first page after page size changes', () => {
    const cb = jest.fn();
    const options: Array<SelectableValue<number>> = [
      {
        label: '50',
        value: 50,
      },
      {
        label: '100',
        value: 100,
      },
    ];

    render(
      <Pagination
        pagesPerView={3}
        totalItems={15}
        pageCount={5}
        pageSizeOptions={options}
        pageSize={3}
        nrRowsOnCurrentPage={3}
        onPageChange={jest.fn()}
        onPageSizeChange={cb}
      />
    );

    for (let i = 0; i < 5; i += 1) {
      userEvent.click(screen.getByTestId('next-page-button'), {});
    }

    // TODO: replace with the following line when data-testid will be available in the Select component
    // const select = screen.getByTestId('pagination-size-select');
    const select = document.querySelector('input');

    if (select) {
      userEvent.type(select, '{arrowdown}');
    }

    const lastOption = screen.getAllByLabelText('Select option').slice(-1)[0];

    userEvent.click(lastOption);
    expect(cb).toHaveBeenCalledWith(100);
    expect(screen.getAllByTestId('page-button')[0]).toBeEnabled();
  });
});
