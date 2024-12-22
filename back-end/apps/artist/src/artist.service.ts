import { PrismaService } from '@app/shared/prisma/prisma.service';
import { AlbumListRequest } from '@app/shared/schema/artist.schema';
import { Album, AlBumArtistSong, Artist } from '@app/shared/types/artist.type';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ArtistService {
  constructor(private readonly prismaService: PrismaService) {}

  async getArtistDetail(artist_id: number): Promise<Artist> {
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
      ? { contains: albumRequest.albumName }
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
}
