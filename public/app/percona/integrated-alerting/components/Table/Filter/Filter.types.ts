import { ExtendedColumn } from '../Table.types';

export interface FilterProps {
  rawData: object[];
  columns: Array<ExtendedColumn<any>>;
  setFilteredData: (data: Object[]) => void;
}
