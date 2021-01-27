import { PAGE_SIZES } from './Table.constants';

export const getProperPageSize = (pageSize: number) => (PAGE_SIZES.includes(pageSize) ? pageSize : PAGE_SIZES[0]);
