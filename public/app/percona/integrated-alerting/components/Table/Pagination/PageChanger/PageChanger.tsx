import React, { FC } from 'react';
import { useStyles, IconName, Button } from '@grafana/ui';
import { PageChangerProps } from './PageChanger.types';
import { getStyles } from './PageChanger.styles';

export const PageChanger: FC<PageChangerProps> = ({
  activePageIndex,
  pageCount,
  shownPages,
  showFirstLastPageButtons,
  disabled,
  gotoPage,
}) => {
  const styles = useStyles(getStyles);

  return (
    <span className={styles.pageChangerContainer}>
      {showFirstLastPageButtons && (
        <Button
          data-testid="first-page-button"
          icon={'angle-double-left' as IconName}
          variant="secondary"
          disabled={activePageIndex === 0 || disabled}
          onClick={() => gotoPage(0)}
        />
      )}
      <Button
        data-testid="previous-page-button"
        icon="angle-left"
        variant="secondary"
        disabled={activePageIndex === 0 || disabled}
        onClick={() => gotoPage(activePageIndex - 1)}
      />
      {shownPages.map((page) => (
        <Button
          data-testid="page-button"
          variant={activePageIndex === page ? 'primary' : 'secondary'}
          onClick={() => gotoPage(page)}
          key={page}
          disabled={disabled}
        >
          {page + 1}
        </Button>
      ))}
      <Button
        data-testid="next-page-button"
        icon="angle-right"
        variant="secondary"
        disabled={activePageIndex === pageCount - 1 || disabled}
        onClick={() => gotoPage(activePageIndex + 1)}
        className="next-page"
      />
      {showFirstLastPageButtons && (
        <Button
          data-testid="last-page-button"
          icon={'angle-double-right' as IconName}
          variant="secondary"
          disabled={activePageIndex === pageCount - 1 || disabled}
          onClick={() => gotoPage(pageCount - 1)}
        />
      )}
    </span>
  );
};
