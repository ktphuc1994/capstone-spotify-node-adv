import { BadRequestException, Controller, UsePipes } from '@nestjs/common';
import { SongService } from './song.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SONG_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { stringIntegerSchema } from '@app/shared/schema/common.schema';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';
import { EnhancedParseIntPipe } from '@app/shared/pipes/parse-int.pipe';
import { SongRequest, songRequestSchema } from '@app/shared/schema/song.schema';

@Controller()
export class SongController {
  constructor(private readonly songService: SongService) {}

  @MessagePattern(SONG_PATTERN.SEARCH_SONG)
  @UsePipes(new ZodValidationPipe(songRequestSchema))
  searchSong(@Payload() songRequest: SongRequest) {
    return this.songService.searchSong(songRequest);
  }

  @MessagePattern(SONG_PATTERN.SEARCH_GENRE)
  searchGenre(@Payload() genre?: string) {
    if (genre && typeof genre !== 'string')
      throw new BadRequestException("'genre' phải là dạng string");

    return this.songService.searchGenre(genre);
  }

  @MessagePattern(SONG_PATTERN.GET_BY_GENRE_ID)
  getSongByGenre(@Payload() genreId?: string) {
    let genreIdList: number[] | undefined = undefined;
    if (genreId) {
      const validatePipe = new ZodValidationPipe(stringIntegerSchema.array());
      genreIdList = validatePipe.transform(genreId?.split(','), {
        type: 'custom',
      });
    }

    return this.songService.getSongByGenre(genreIdList);
  }

  @MessagePattern(SONG_PATTERN.GET_SONG_DETAIL)
  getSongDetail(
    @Payload(new EnhancedParseIntPipe({ fieldName: 'songId' })) songId: number,
  ) {
    return this.songService.getSongDetail(songId);
  }
}
