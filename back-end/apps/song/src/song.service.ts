import { PrismaService } from '@app/shared/prisma/prisma.service';
import {
  Album,
  AlBumArtistSong,
  FullSongInfo,
  GenreWithSong,
  PlaylistInfo,
} from '@app/shared/types/song.type';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SongService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSongByGenre(genreList?: number[]): Promise<GenreWithSong[]> {
    const rawResult = await this.prismaService.genre.findMany({
      where: { genre_id: { in: genreList } },
      include: {
        genre_song: {
          select: {
            song: {
              select: {
                artist: { select: { artist_id: true, artist_name: true } },
                song_id: true,
                song_name: true,
              },
            },
          },
        },
      },
    });

    return rawResult.map(({ genre_id, genre_name, genre_song }) => {
      const songList = genre_song.map((songInfo) => songInfo.song);
      return {
        genre_id,
        genre_name,
        songList,
      };
    });
  }

  async getSongDetail(song_id: number): Promise<FullSongInfo> {
    const songInfo = await this.prismaService.song.findFirst({
      where: { song_id },
      include: {
        artist: { select: { artist_id: true, artist_name: true } },
        genre_song: {
          select: { genre: { select: { genre_id: true, genre_name: true } } },
        },
        album: { select: { album_id: true, album_name: true } },
      },
    });
    if (!songInfo) throw new NotFoundException('Bài hát không tồn tại');

    const { genre_song, ...rest } = songInfo;
    return { ...rest, genre: genre_song.map((genreInfo) => genreInfo.genre) };
  }

  async getAlbumList(artist_id: number): Promise<Omit<Album, 'artist_id'>[]> {
    return this.prismaService.album.findMany({
      where: { artist_id },
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
