import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { AlbumListRequest } from '@app/shared/schema/artist.schema';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get(':artistId')
  getArtistDetail(@Param('artistId') artistId: string) {
    return this.artistService.getArtistDetail(artistId);
  }

  @Get('album/list')
  getAlbumList(@Query() albumRequest: AlbumListRequest) {
    return this.artistService.getAlbumList(albumRequest);
  }

  @Get('album/:albumId')
  getAlbumDetail(@Param('albumId') albumId: string) {
    return this.artistService.getAlbumDetail(albumId);
  }
}
