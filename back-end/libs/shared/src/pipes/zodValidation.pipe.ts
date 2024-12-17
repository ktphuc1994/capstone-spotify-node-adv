import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { z, ZodError, ZodSchema, ZodType } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodType<T>) {}

  transform(value: unknown, _metadata: ArgumentMetadata): T {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (!(error instanceof ZodError))
        throw new BadRequestException('Validation failed');

      let errorMessage = '';
      error.errors.forEach((zodIssue) => {
        const issuePath = zodIssue.path.join('.');
        errorMessage += `'${issuePath}' ${zodIssue.message}. `;
      });

      throw new BadRequestException(errorMessage);
    }
  }
}
