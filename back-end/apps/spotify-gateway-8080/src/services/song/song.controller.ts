import { Controller, Get, Param, Query } from '@nestjs/common';
import { SongService } from './song.service';
import { SongRequest } from '@app/shared/schema/song.schema';

@Controller('song')
export class SongController {
  constructor(private songService: SongService) {}

  @Get('search')
  searchSong(@Query() songRequest: SongRequest) {
    return this.songService.searchSong(songRequest);
  }

  @Get('genre')
  searchGenre(@Query('genre') genre: string) {
    return this.songService.searchGenre(genre);
  }

  @Get('get-by-genre')
  getByGenre(@Query('genre-id') genreId: string) {
    console.log(genreId);
    return this.songService.getByGenre(genreId);
  }

  @Get('detail/:songId')
  getSongDetail(@Param('songId') songId: string) {
    return this.songService.getSongDetail(songId);
  }
}
