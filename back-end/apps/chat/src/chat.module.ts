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
import { CacheModule } from '@nestjs/cache-manager';
import { GatewayGlobalExceptionsFilter } from 'apps/spotify-gateway-8080/src/exceptions/global-exception.filter';
import { GatewayHttpExceptionsFilter } from 'apps/spotify-gateway-8080/src/exceptions/http-exception.filter';
import { PresenceGateway } from './gateway/presence.gateway';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule.registerRmq(AUTH_SERVICE_NAME, AUTH_QUEUE),
    SharedModule.registerRmq(USER_SERVICE_NAME, USER_QUEUE),
  ],
  providers: [
    PresenceGateway,
    { provide: APP_FILTER, useClass: GatewayGlobalExceptionsFilter },
    { provide: APP_FILTER, useClass: GatewayHttpExceptionsFilter },
  ],
})
export class ChatModule {}
