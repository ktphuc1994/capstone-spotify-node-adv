import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';
import {
  ARTIST_QUEUE,
  ARTIST_SERVICE_NAME,
  AUTH_QUEUE,
  AUTH_SERVICE_NAME,
  CHAT_QUEUE,
  CHAT_SERVICE_NAME,
  PLAYLIST_QUEUE,
  PLAYLIST_SERVICE_NAME,
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
import { ArtistController } from './services/artist/artist.controller';
import { ArtistService } from './services/artist/artist.service';
import { PlaylistController } from './services/playlist/playlist.controller';
import { PlaylistService } from './services/playlist/playlist.service';
import { ChatController } from './services/chat/chat.controller';
import { ChatService } from './services/chat/chat.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    SharedModule.registerRmq(AUTH_SERVICE_NAME, AUTH_QUEUE),
    SharedModule.registerRmq(SONG_SERVICE_NAME, SONG_QUEUE),
    SharedModule.registerRmq(USER_SERVICE_NAME, USER_QUEUE),
    SharedModule.registerRmq(ARTIST_SERVICE_NAME, ARTIST_QUEUE),
    SharedModule.registerRmq(PLAYLIST_SERVICE_NAME, PLAYLIST_QUEUE),
    SharedModule.registerRmq(CHAT_SERVICE_NAME, CHAT_QUEUE),
  ],
  controllers: [
    AppController,
    AuthController,
    SongController,
    UserController,
    ArtistController,
    PlaylistController,
    ChatController,
  ],
  providers: [
    AppService,
    AuthService,
    SongService,
    UserService,
    ArtistService,
    PlaylistService,
    ChatService,
    { provide: APP_FILTER, useClass: GatewayGlobalExceptionsFilter },
    { provide: APP_FILTER, useClass: GatewayHttpExceptionsFilter },
  ],
})
export class AppModule {}
