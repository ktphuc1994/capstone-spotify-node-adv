import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { PrismaModule } from '@app/shared/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { MicroserviceHttpExceptionFilter } from '@app/shared/exceptions/microservice-http-exceptions.filter';
import { PrismaClientExceptionFilter } from '@app/shared/exceptions/prisma-client-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule,
    PrismaModule,
  ],
  controllers: [PlaylistController],
  providers: [
    PlaylistService,
    { provide: APP_FILTER, useClass: MicroserviceHttpExceptionFilter },
    { provide: APP_FILTER, useClass: PrismaClientExceptionFilter },
  ],
})
export class PlaylistModule {}
