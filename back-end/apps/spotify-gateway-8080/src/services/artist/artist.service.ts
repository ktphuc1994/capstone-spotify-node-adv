import { ARTIST_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { ARTIST_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import {
  AlbumListRequest,
  ArtistRequest,
} from '@app/shared/schema/artist.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(ARTIST_SERVICE_NAME) private artistMicroservice: ClientProxy,
  ) {}

  searchArtist(artistRequest: ArtistRequest) {
    return this.artistMicroservice.send(
      ARTIST_PATTERN.SEARCH_ARTIST,
      artistRequest,
    );
  }

  getArtistDetail(artistId: string) {
    return this.artistMicroservice.send(
      ARTIST_PATTERN.GET_ARTIST_DETAIL,
      artistId,
    );
  }

  getAlbumList(albumRequest: AlbumListRequest) {
    return this.artistMicroservice.send(
      ARTIST_PATTERN.GET_ALBUM_LIST,
      albumRequest,
    );
  }

  getAlbumDetail(albumId: string) {
    return this.artistMicroservice.send(
      ARTIST_PATTERN.GET_ALBUM_DETAIL,
      albumId,
    );
  }

  followArtist(artistId: string, userId: number) {
    return this.artistMicroservice.send(ARTIST_PATTERN.FOLLOW_ARTIST, {
      artistId,
      userId,
    });
  }

  unfollowArtist(artistId: string, userId: number) {
    return this.artistMicroservice.send(ARTIST_PATTERN.UNFOLLOW_ARTIST, {
      artistId,
      userId,
    });
  }
}
