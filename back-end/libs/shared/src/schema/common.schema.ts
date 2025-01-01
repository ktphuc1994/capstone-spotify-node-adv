import { z } from 'zod';
import { checkIsInteger } from '../utils/number';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/common';

const stringIntegerSchema = z
  .custom<number>(
    (v) => {
      if (typeof v !== 'string') return false;
      return checkIsInteger(v);
    },
    { message: 'Định dạng phải là Integer' },
  )
  .transform((v) => Number(v));

const paginationRequestSchema = z.object({
  page: z.number().default(DEFAULT_PAGE),
  pageSize: z.number().default(DEFAULT_PAGE_SIZE),
});
type PaginationRequest = z.input<typeof paginationRequestSchema>;

const queryPaginationRequestSchema = z.object({
  page: stringIntegerSchema.default(DEFAULT_PAGE).optional(),
  pageSize: stringIntegerSchema.default(DEFAULT_PAGE_SIZE).optional(),
});

export {
  stringIntegerSchema,
  paginationRequestSchema,
  queryPaginationRequestSchema,
  type PaginationRequest,
};
