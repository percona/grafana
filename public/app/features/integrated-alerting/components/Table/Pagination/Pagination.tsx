import React, { FC, useState, useMemo } from 'react';
import { PaginationProps } from './Pagination.types';

export const Pagination: FC<PaginationProps> = ({ pageCount, initialPageIndex, pagesPerView, onPageChange }) => {
  // Zero pages probably won't make the pagination show up, but here we should be agnostic to that
  pageCount = Math.max(pageCount, 1);
  const [activePageIndex, setActivePageIndex] = useState(initialPageIndex);
  const pageArray = useMemo(() => [...Array(pageCount).keys()], [pageCount]);
  const maxVisiblePages = Math.min(pagesPerView, pageCount);
  // We want to center our selected page, thus we need to know how many should be on the left
  const pagesBehind = pagesPerView - (pagesPerView - Math.ceil(pagesPerView / 2)) - 1;
  let firstPageIndex = Math.max(activePageIndex - pagesBehind, 0);
  let lastPageIndex = firstPageIndex + maxVisiblePages;

  // If we can't keep the selected page in the center anymore, it should just move rightwards
  if (lastPageIndex >= pageCount + 1 && lastPageIndex - maxVisiblePages > 0) {
    lastPageIndex = pageCount;
    firstPageIndex = lastPageIndex - maxVisiblePages;
  }
  const shownPages = pageArray.slice(firstPageIndex, lastPageIndex);

  const gotoPage = (pageIndex: number) => {
    if (pageIndex < 0) {
      pageIndex = 0;
    } else if (pageIndex > pageCount - 1) {
      pageIndex = pageCount - 1;
    }
    setActivePageIndex(pageIndex);
    onPageChange(pageIndex);
  };

  return (
    <div data-qa="pagination">
      <button disabled={activePageIndex === 0} onClick={() => gotoPage(0)}>
        {'<<'}
      </button>
      <button disabled={activePageIndex === 0} onClick={() => gotoPage(activePageIndex - 1)} className="prev-page">
        {'<'}
      </button>
      {shownPages.map(page => (
        <button onClick={() => gotoPage(page)} key={page} className={activePageIndex === page ? 'active' : ''}>
          {page + 1}
        </button>
      ))}
      <button
        disabled={activePageIndex === pageCount - 1}
        onClick={() => gotoPage(activePageIndex + 1)}
        className="next-page"
      >
        {'>'}
      </button>
      <button disabled={activePageIndex === pageCount - 1} onClick={() => gotoPage(pageCount - 1)}>
        {'>>'}
      </button>
    </div>
  );
};

Pagination.defaultProps = {
  pageCount: 1,
  initialPageIndex: 0,
  pagesPerView: 1,
  onPageChange: () => 0,
};
