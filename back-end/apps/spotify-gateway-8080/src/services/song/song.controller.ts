import { Controller, Get, Param, Query } from '@nestjs/common';
import { SongService } from './song.service';

@Controller('song')
export class SongController {
  constructor(private songService: SongService) {}

  @Get('get-by-genre')
  getByGenre(@Query('genre-id') genreId: string = '') {
    return this.songService.getByGenre(genreId);
  }

  @Get('detail/:songId')
  getSongDetail(@Param('songId') songId: string) {
    return this.songService.getSongDetail(songId);
  }

  @Get('album/list/:artistId')
  getAlbumList(@Param('artistId') albumId: string) {
    return this.songService.getAlbumList(albumId);
  }

  @Get('album/:albumId')
  getAlbumDetail(@Param('albumId') albumId: string) {
    return this.songService.getAlbumDetail(albumId);
  }
}
