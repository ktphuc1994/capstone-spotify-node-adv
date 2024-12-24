import { Controller, UsePipes } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ARTIST_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { EnhancedParseIntPipe } from '@app/shared/pipes/parse-int.pipe';
import {
  AlbumListRequest,
  albumListRequestSchema,
  ArtistRequest,
  artistRequestSchema,
} from '@app/shared/schema/artist.schema';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';

@Controller()
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @MessagePattern(ARTIST_PATTERN.SEARCH_ARTIST)
  @UsePipes(new ZodValidationPipe(artistRequestSchema))
  searchArtist(@Payload() artistRequest: ArtistRequest) {
    return this.artistService.searchArtist(artistRequest);
  }

  @MessagePattern(ARTIST_PATTERN.GET_ARTIST_DETAIL)
  @UsePipes(EnhancedParseIntPipe)
  getArtistDetail(@Payload() artistId: number) {
    return this.artistService.getArtistDetail(artistId);
  }

  @MessagePattern(ARTIST_PATTERN.GET_ALBUM_LIST)
  @UsePipes(new ZodValidationPipe(albumListRequestSchema))
  getAlbumList(@Payload() albumRequest: AlbumListRequest) {
    return this.artistService.getAlbumList(albumRequest);
  }

  @MessagePattern(ARTIST_PATTERN.GET_ALBUM_DETAIL)
  getAlbumDetail(
    @Payload(new EnhancedParseIntPipe({ fieldName: 'albumId' }))
    albumId: number,
  ) {
    return this.artistService.getAlbumDetail(albumId);
  }
}
