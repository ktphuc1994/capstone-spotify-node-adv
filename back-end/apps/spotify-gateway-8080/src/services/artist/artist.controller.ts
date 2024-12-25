import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import {
  AlbumListRequest,
  ArtistRequest,
} from '@app/shared/schema/artist.schema';
import { AppGuard } from '@app/shared/guards/app.guard';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { UserInReq } from '@app/shared/types/shared.type';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get('search')
  searchArtist(@Query() artistRequest: ArtistRequest) {
    return this.artistService.searchArtist(artistRequest);
  }

  @Get('album')
  getAlbumList(@Query() albumRequest: AlbumListRequest) {
    return this.artistService.getAlbumList(albumRequest);
  }

  @Get(':artistId')
  getArtistDetail(@Param('artistId') artistId: string) {
    return this.artistService.getArtistDetail(artistId);
  }

  @Get('album/:albumId')
  getAlbumDetail(@Param('albumId') albumId: string) {
    return this.artistService.getAlbumDetail(albumId);
  }

  @UseGuards(AppGuard)
  @Post('follow/:artistId')
  followArtist(
    @CurrentUser() userInfo: UserInReq,
    @Param('artistId') artistId: string,
  ) {
    return this.artistService.followArtist(artistId, userInfo.user_id);
  }

  @UseGuards(AppGuard)
  @Delete('unfollow/:artistId')
  unfollowArtist(
    @CurrentUser() userInfo: UserInReq,
    @Param('artistId') artistId: string,
  ) {
    return this.artistService.unfollowArtist(artistId, userInfo.user_id);
  }
}
