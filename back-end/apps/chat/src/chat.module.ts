import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import { APP_FILTER } from '@nestjs/core';
import {
  AUTH_QUEUE,
  AUTH_SERVICE_NAME,
  USER_QUEUE,
  USER_SERVICE_NAME,
} from '@app/shared/constants/microservice.const';
import { PresenceGateway } from './gateway/presence.gateway';
import { PrismaModule } from '@app/shared/prisma/prisma.module';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './services/chat.service';
import { RedisModule } from '@app/shared/redis/redis.module';
import { MicroserviceHttpExceptionFilter } from '@app/shared/exceptions/microservice-http-exceptions.filter';
import { PrismaClientExceptionFilter } from '@app/shared/exceptions/prisma-client-exceptions.filter';
import { PresenceService } from './services/presence.service';
import { ChatController } from './services/chat.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    PrismaModule,
    RedisModule,
    SharedModule.registerRmq(AUTH_SERVICE_NAME, AUTH_QUEUE),
    SharedModule.registerRmq(USER_SERVICE_NAME, USER_QUEUE),
  ],
  controllers: [ChatController],
  providers: [
    PresenceGateway,
    ChatGateway,
    ChatService,
    PresenceService,
    { provide: APP_FILTER, useClass: MicroserviceHttpExceptionFilter },
    { provide: APP_FILTER, useClass: PrismaClientExceptionFilter },
  ],
})
export class ChatModule {}
