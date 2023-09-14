export interface PagedResult<T> {
    data: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  }
  