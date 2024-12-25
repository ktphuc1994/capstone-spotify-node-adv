import { Catch, HttpStatus, RpcExceptionFilter } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prismaErrorCodes } from '../constants/prismaErrorCode.const';
import { Observable, throwError } from 'rxjs';
import { MicroserviceHttpExceptionType } from '../types/shared.type';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter
  implements RpcExceptionFilter<PrismaClientKnownRequestError>
{
  catch(
    exception: PrismaClientKnownRequestError,
  ): Observable<MicroserviceHttpExceptionType> {
    switch (exception.code) {
      case prismaErrorCodes.outRange: {
        return throwError(() => ({
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            "The provided value for the column is too long for the column's type",
          error: exception.meta ? exception.meta : exception.code,
        }));
      }
      case prismaErrorCodes.unique: {
        return throwError(() => ({
          statusCode: HttpStatus.CONFLICT,
          message: 'Unique constraint failed',
          error: exception.meta ? exception.meta : exception.code,
        }));
      }
      case prismaErrorCodes.foreignKey: {
        return throwError(() => ({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Foreign Key failed. Record(s) not found',
          error: exception.meta ? exception.meta : exception.code,
        }));
      }
      case prismaErrorCodes.notFound: {
        return throwError(() => ({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'The provided record is not found',
          error: exception.meta ? exception.meta : exception.code,
        }));
      }
      default:
        // default 500 error code
        // super.catch(exception, host);
        return throwError(() => ({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Failed when executing request at database. Prisma Error Code: ${exception.code}`,
          error: exception.meta ? exception.meta : exception.code,
        }));
    }
  }
}
