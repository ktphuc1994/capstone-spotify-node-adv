import { prismaErrorCodes } from '@app/shared/constants/prismaErrorCode.const';
import { PrismaService } from '@app/shared/prisma/prisma.service';
import {
  AlbumListRequest,
  ArtistRequest,
} from '@app/shared/schema/artist.schema';
import {
  Album,
  AlBumArtistSong,
  Artist,
  FullArtist,
} from '@app/shared/types/artist.type';
import {
  catchPrismaNotFound,
  catchPrismaUnique,
} from '@app/shared/utils/prisma';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ArtistService {
  constructor(private readonly prismaService: PrismaService) {}

  async searchArtist(artistRequest: ArtistRequest): Promise<Artist[]> {
    const artistNameQuery = artistRequest.artistName
      ? ({ contains: artistRequest.artistName, mode: 'insensitive' } as const)
      : undefined;

    return this.prismaService.artist.findMany({
      where: {
        artist_id: artistRequest.artistId,
        artist_name: artistNameQuery,
      },
      select: { artist_id: true, artist_name: true, artist_cover: true },
    });
  }

  async getArtistDetail(artist_id: number): Promise<FullArtist> {
    const artistInfo = await this.prismaService.artist.findFirst({
      where: { artist_id },
      omit: { created_at: true, updated_at: true },
    });

    if (!artistInfo) throw new NotFoundException('Nghệ sĩ không tồn tại');

    return artistInfo;
  }

  async getAlbumList(
    albumRequest: AlbumListRequest,
  ): Promise<Omit<Album, 'artist_id'>[]> {
    const albumNameQuery = albumRequest.albumName
      ? ({ contains: albumRequest.albumName, mode: 'insensitive' } as const)
      : undefined;

    return this.prismaService.album.findMany({
      where: {
        artist_id: albumRequest.artistId,
        album_name: albumNameQuery,
      },
      select: {
        album_id: true,
        album_name: true,
        album_cover: true,
        release_date: true,
      },
    });
  }

  async getAlbumDetail(album_id: number): Promise<AlBumArtistSong> {
    const albumInfo = await this.prismaService.album.findFirst({
      where: { album_id },
      select: {
        album_id: true,
        album_name: true,
        album_cover: true,
        release_date: true,
        artist: { select: { artist_id: true, artist_name: true } },
        song: { select: { song_id: true, song_name: true, duration: true } },
      },
    });

    if (!albumInfo) throw new NotFoundException('Album không tồn tại');

    return albumInfo;
  }

  async followArtist(artist_id: number, user_id: number) {
    try {
      return await this.prismaService.user_artist_follow.create({
        data: { artist_id, user_id },
      });
    } catch (error) {
      catchPrismaUnique(error, 'Artist đã được follow từ trước');
    }
  }

  async unfollowArtist(artist_id: number, user_id: number) {
    try {
      return await this.prismaService.user_artist_follow.delete({
        where: { user_id_artist_id: { artist_id, user_id } },
      });
    } catch (error) {
      catchPrismaNotFound(error, 'Artist không có trong danh sách follow');
    }
  }
}
