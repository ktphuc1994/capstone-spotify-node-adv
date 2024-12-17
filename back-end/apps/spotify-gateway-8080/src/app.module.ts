import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import {
  AUTH_QUEUE,
  AUTH_SERVICE_NAME,
  SONG_QUEUE,
  SONG_SERVICE_NAME,
  USER_QUEUE,
  USER_SERVICE_NAME,
} from '@app/shared/constants/microservice.const';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './services/auth/auth.controller';
import { APP_FILTER } from '@nestjs/core';
import { GatewayGlobalExceptionsFilter } from './exceptions/global-exception.filter';
import { GatewayHttpExceptionsFilter } from './exceptions/http-exception.filter';
import { SongController } from './services/song/song.controller';
import { SongService } from './services/song/song.service';
import { UserService } from './services/user/user.service';
import { UserController } from './services/user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule.registerRmq(AUTH_SERVICE_NAME, AUTH_QUEUE),
    SharedModule.registerRmq(SONG_SERVICE_NAME, SONG_QUEUE),
    SharedModule.registerRmq(USER_SERVICE_NAME, USER_QUEUE),
  ],
  controllers: [AppController, AuthController, SongController, UserController],
  providers: [
    AppService,
    AuthService,
    SongService,
    UserService,
    { provide: APP_FILTER, useClass: GatewayGlobalExceptionsFilter },
    { provide: APP_FILTER, useClass: GatewayHttpExceptionsFilter },
  ],
})
export class AppModule {}
