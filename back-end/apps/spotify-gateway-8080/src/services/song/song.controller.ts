import { Controller, Get, Query } from '@nestjs/common';
import { SongService } from './song.service';

@Controller('song')
export class SongController {
  constructor(private songServier: SongService) {}

  @Get('get-by-genre')
  getByGenre(@Query('genre-id') genreId: string = '') {
    return this.songServier.getByGenre(genreId);
  }
}
