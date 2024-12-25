import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prismaErrorCodes } from '../constants/prismaErrorCode.const';
import { ConflictException, NotFoundException } from '@nestjs/common';

const catchPrismaUnique = (error: unknown, message: string) => {
  if (
    error instanceof PrismaClientKnownRequestError &&
    error.code === prismaErrorCodes.unique
  ) {
    throw new ConflictException(message);
  }
  throw error;
};

const catchPrismaNotFound = (error: unknown, message: string) => {
  if (
    error instanceof PrismaClientKnownRequestError &&
    error.code === prismaErrorCodes.notFound
  ) {
    throw new NotFoundException(message);
  }
  throw error;
};

export { catchPrismaUnique, catchPrismaNotFound };
