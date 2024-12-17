import { NestFactory } from '@nestjs/core';
import { SharedService } from '@app/shared';
import { SONG_QUEUE } from '@app/shared/constants/microservice.const';
import { SongModule } from './song.module';

async function bootstrap() {
  const app = await NestFactory.create(SongModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice(sharedService.getRmqOptions(SONG_QUEUE), {
    inheritAppConfig: true,
  });
  app.startAllMicroservices();
}
bootstrap();
