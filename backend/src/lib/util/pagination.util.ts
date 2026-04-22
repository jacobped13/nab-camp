import { z } from 'zod';
import { Nullable } from '@common';

export enum SORT_DIRECTION {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum PAGINATION_DIRECTION {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
}

export const SortInputDtoSchema = z.object({
  field: z.string(),
  direction: z.nativeEnum(SORT_DIRECTION),
});

export type SortInputDto = z.infer<typeof SortInputDtoSchema>;

export const CursorPaginationInputDtoSchema = z.object({
  limit: z.number().min(1),
  direction: z.nativeEnum(PAGINATION_DIRECTION),
  cursor: z.string().optional(),
});

export type CursorPaginationInputDto = z.infer<
  typeof CursorPaginationInputDtoSchema
>;

export type CursorPaginationOutputDto<T> = {
  nodes: T[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: Nullable<string>;
  endCursor: Nullable<string>;
};
