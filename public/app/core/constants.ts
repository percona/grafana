import { SelectableValue } from '@grafana/data';

export const GRID_CELL_HEIGHT = 30;
export const GRID_CELL_VMARGIN = 8;
export const GRID_COLUMN_COUNT = 24;
export const REPEAT_DIR_VERTICAL = 'v';

export const DEFAULT_PANEL_SPAN = 4;
export const DEFAULT_ROW_HEIGHT = 250;
export const MIN_PANEL_HEIGHT = GRID_CELL_HEIGHT * 3;

export const LS_PANEL_COPY_KEY = 'panel-copy';

export const PANEL_BORDER = 2;

export const EDIT_PANEL_ID = 23763571993;

export const PAGE_SIZES: Array<SelectableValue<number>> = [
  {
    label: '25',
    value: 25,
  },
  {
    label: '50',
    value: 50,
  },
  {
    label: '100',
    value: 100,
  },
];
