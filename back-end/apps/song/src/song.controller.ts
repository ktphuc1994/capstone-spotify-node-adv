import { Controller, UsePipes } from '@nestjs/common';
import { SongService } from './song.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SONG_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { stringIntegerSchema } from '@app/shared/schema/common.schema';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';
import { z } from 'zod';

@Controller()
export class SongController {
  constructor(private readonly songService: SongService) {}

  @MessagePattern(SONG_PATTERN.GET_BY_GENRE)
  getSongByGenre(@Payload() genreId?: string) {
    console.log(genreId);
    let genreIdList: number[] | undefined = undefined;
    if (genreId) {
      const validatePipe = new ZodValidationPipe(stringIntegerSchema.array());
      genreIdList = validatePipe.transform(genreId?.split(','), {
        type: 'custom',
      });
    }

    return this.songService.getSongByGenre(genreIdList);
  }
}
