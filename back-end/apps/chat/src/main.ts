import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { SharedService } from '@app/shared';
import { CHAT_QUEUE } from '@app/shared/constants/microservice.const';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  const sharedService = app.get(SharedService);

  app.connectMicroservice(sharedService.getRmqOptions(CHAT_QUEUE), {
    inheritAppConfig: true,
  });
  app.startAllMicroservices();
  await app.listen(8081);
}
bootstrap();
