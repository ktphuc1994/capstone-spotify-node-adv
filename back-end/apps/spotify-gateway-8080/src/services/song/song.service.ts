import { SONG_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { SONG_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SongService {
  constructor(
    @Inject(SONG_SERVICE_NAME) private songMicroservice: ClientProxy,
  ) {}

  getByGenre(genreId?: string) {
    return this.songMicroservice.send(SONG_PATTERN.GET_BY_GENRE, genreId);
  }
}
