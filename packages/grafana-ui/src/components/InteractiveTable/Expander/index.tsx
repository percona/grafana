import { css } from '@emotion/css';
import { CellProps, HeaderProps } from 'react-table';

import { t } from '@grafana/i18n';

import { IconButton } from '../../IconButton/IconButton';

const expanderContainerStyles = css({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
});

export function ExpanderCell<K extends object>({ row, __rowID }: CellProps<K, void>) {
  return (
    <div className={expanderContainerStyles}>
      <IconButton
        tooltip={t('grafana-ui.interactive-table.expand-row-tooltip', 'Toggle row expanded')}
        aria-controls={__rowID}
        // @PERCONA - ignore errors related to expandable rows
        // @ts-ignore
        name={row.isExpanded ? 'angle-down' : 'angle-right'}
        // @PERCONA - ignore errors related to expandable rows
        // @ts-ignore
        aria-expanded={row.isExpanded}
        // @PERCONA - ignore errors related to expandable rows
        // @ts-ignore
        {...row.getToggleRowExpandedProps()}
        size="lg"
      />
    </div>
  );
}

export function ExpanderHeader<K extends object>({ isAllRowsExpanded, toggleAllRowsExpanded }: HeaderProps<K>) {
  return (
    <div className={expanderContainerStyles}>
      <IconButton
        aria-label={
          !isAllRowsExpanded
            ? t('grafana-ui.interactive-table.aria-label-expand-all', 'Expand all rows')
            : t('grafana-ui.interactive-table.aria-label-collapse-all', 'Collapse all rows')
        }
        name={!isAllRowsExpanded ? 'table-expand-all' : 'table-collapse-all'}
        onClick={() => toggleAllRowsExpanded()}
        size={'lg'}
        tooltip={
          !isAllRowsExpanded
            ? t('grafana-ui.interactive-table.tooltip-expand-all', 'Expand all rows')
            : t('grafana-ui.interactive-table.tooltip-collapse-all', 'Collapse all rows')
        }
        variant={'secondary'}
      />
    </div>
  );
}
