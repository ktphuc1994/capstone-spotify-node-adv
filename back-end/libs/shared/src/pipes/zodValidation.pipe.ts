import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ZodError, ZodType } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(
    private schema: ZodType<T>,
    private errorType?: 'ws' | 'http',
  ) {}

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

      if (this.errorType === 'ws') {
        throw new WsException(errorMessage);
      }

      throw new BadRequestException(errorMessage);
    }
  }
}
