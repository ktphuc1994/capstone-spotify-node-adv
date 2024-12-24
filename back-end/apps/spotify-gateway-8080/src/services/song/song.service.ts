import { SONG_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { SONG_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import { SongRequest } from '@app/shared/schema/song.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SongService {
  constructor(
    @Inject(SONG_SERVICE_NAME) private songMicroservice: ClientProxy,
  ) {}

  searchSong(songRequest: SongRequest) {
    return this.songMicroservice.send(SONG_PATTERN.SEARCH_SONG, songRequest);
  }

  searchGenre(genre: string) {
    return this.songMicroservice.send(SONG_PATTERN.SEARCH_GENRE, genre);
  }

  getByGenre(genreId?: string) {
    return this.songMicroservice.send(SONG_PATTERN.GET_BY_GENRE_ID, genreId);
  }

  getSongDetail(songId: string) {
    return this.songMicroservice.send(SONG_PATTERN.GET_SONG_DETAIL, songId);
  }
}
