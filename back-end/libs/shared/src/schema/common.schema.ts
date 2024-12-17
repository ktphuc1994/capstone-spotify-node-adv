import { z } from 'zod';
import { checkIsInteger } from '../utils/number';

const stringIntegerSchema = z
  .custom<number>(
    (v) => {
      if (typeof v !== 'string') return false;
      return checkIsInteger(v);
    },
    { message: 'Định dạng phải là Integer' },
  )
  .transform((v) => Number(v));

export { stringIntegerSchema };
