import { PAGE_SIZES } from './Pagination/Pagination.constants';

export const getProperPageSize = (pageSize: number) =>
  PAGE_SIZES.find(p => p.value === pageSize) ? pageSize : PAGE_SIZES[0].value;
