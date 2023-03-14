// TODO: Remove this block after @types/react-table gets updated
import { CSSProperties } from 'react';

declare module 'react-table' {
  interface Row {
    isExpanded: boolean;
    getToggleRowExpandedProps?: () => void;
  }

  interface HeaderGroup {
    className?: string;
    style?: CSSProperties;
  }

  interface ColumnInstance {
    className?: string;
    style?: CSSProperties;
  }
}
