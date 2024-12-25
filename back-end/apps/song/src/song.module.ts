import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { PrismaModule } from '@app/shared/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { MicroserviceHttpExceptionFilter } from '@app/shared/exceptions/microservice-http-exceptions.filter';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { PrismaClientExceptionFilter } from '@app/shared/exceptions/prisma-client-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule,
    PrismaModule,
  ],
  controllers: [SongController],
  providers: [
    SongService,
    { provide: APP_FILTER, useClass: MicroserviceHttpExceptionFilter },
    { provide: APP_FILTER, useClass: PrismaClientExceptionFilter },
  ],
})
export class SongModule {}
