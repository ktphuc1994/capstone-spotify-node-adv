import { NestFactory } from '@nestjs/core';
import { ArtistModule } from './artist.module';
import { SharedService } from '@app/shared';
import { ARTIST_QUEUE } from '@app/shared/constants/microservice.const';

async function bootstrap() {
  const app = await NestFactory.create(ArtistModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice(sharedService.getRmqOptions(ARTIST_QUEUE), {
    inheritAppConfig: true,
  });
  app.startAllMicroservices();
}
bootstrap();
