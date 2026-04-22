// -----------------------------------------------------------------
// Base Types
// -----------------------------------------------------------------

export interface ErrorResponseBody {
  title: string;
  status: number;
  detail: string;
}

export interface BulkOperationError {
  title: string;
  status: number;
  detail: string;
}

export type BulkOperationResponseBody<
  T,
  E extends BulkOperationError = BulkOperationError
> = {
  data: T;
  errors: E[];
};

export enum PAGINATION_DIRECTION {
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD",
}

export enum SORT_DIRECTION {
  ASC = "ASC",
  DESC = "DESC",
}

export type CursorPaginationResponseBody<T> = {
  nodes: T[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};
