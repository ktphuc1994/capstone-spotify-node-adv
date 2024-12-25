import { NestFactory } from '@nestjs/core';
import { PlaylistModule } from './playlist.module';
import { SharedService } from '@app/shared';
import { PLAYLIST_QUEUE } from '@app/shared/constants/microservice.const';

async function bootstrap() {
  const app = await NestFactory.create(PlaylistModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice(sharedService.getRmqOptions(PLAYLIST_QUEUE), {
    inheritAppConfig: true,
  });
  app.startAllMicroservices();
}
bootstrap();
