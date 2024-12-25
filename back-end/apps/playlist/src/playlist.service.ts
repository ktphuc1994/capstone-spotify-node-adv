import { PrismaService } from '@app/shared/prisma/prisma.service';
import {
  CreatePlaylistRequest,
  UpdatePlaylistRequest,
  UpdatePlaylistSongRequest,
} from '@app/shared/schema/playlist.schema';
import { Playlist, PlaylistInfo } from '@app/shared/types/song.type';
import {
  catchPrismaNotFound,
  catchPrismaUnique,
} from '@app/shared/utils/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PlaylistService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkPlaylistExist(
    user_id: number,
    playlist_id: number,
  ): Promise<boolean> {
    const existedPlaylist = await this.prismaService.playlist.findFirst({
      where: { user_id, playlist_id },
      select: { playlist_id: true },
    });
    return !!existedPlaylist;
  }

  async getPlaylist(user_id: number): Promise<Omit<Playlist, 'user_id'>[]> {
    return this.prismaService.playlist.findMany({
      where: { user_id },
      select: { playlist_id: true, playlist_name: true, playlist_cover: true },
    });
  }

  async createPlaylist({
    playlistName,
    userId,
    playlistCover,
  }: CreatePlaylistRequest) {
    return await this.prismaService.playlist.create({
      data: {
        playlist_name: playlistName,
        user_id: userId,
        playlist_cover: playlistCover,
      },
    });
  }

  async updatePlaylist(requestInfo: UpdatePlaylistRequest) {
    try {
      return await this.prismaService.playlist.update({
        where: {
          playlist_id: requestInfo.playlistId,
          user_id: requestInfo.userId,
        },
        data: {
          playlist_name: requestInfo.playlistName,
          playlist_cover: requestInfo.playlistCover,
        },
      });
    } catch (error) {
      catchPrismaNotFound(error, 'Playlist không tồn tại');
    }
  }

  async removePlaylist(user_id: number, playlist_id: number) {
    const isPlaylistExist = await this.checkPlaylistExist(user_id, playlist_id);
    if (!isPlaylistExist) throw new NotFoundException('Playlist không tồn tại');

    await this.prismaService.$transaction(async (tx) => {
      await tx.playlist_song.deleteMany({ where: { playlist_id } });
      await tx.playlist.delete({ where: { playlist_id, user_id } });
    });

    return 'Xóa playlist thành công';
  }

  async getPlaylistDetail(
    user_id: number,
    playlist_id: number,
  ): Promise<PlaylistInfo> {
    const playlistInfo = await this.prismaService.playlist.findFirst({
      where: { playlist_id, user_id },
      select: {
        playlist_id: true,
        playlist_name: true,
        playlist_cover: true,
        playlist_song: {
          select: {
            song: {
              select: {
                song_id: true,
                song_name: true,
                cover: true,
                duration: true,
                artist: { select: { artist_id: true, artist_name: true } },
                album: { select: { album_id: true, album_name: true } },
              },
            },
            created_at: true,
          },
        },
      },
    });

    if (!playlistInfo) throw new NotFoundException('Playlist không tồn tại');

    const { playlist_song, ...rest } = playlistInfo;
    const songList = playlist_song.map((songInfo) => ({
      ...songInfo.song,
      added_at: songInfo.created_at,
    }));

    return { ...rest, songList };
  }

  async addSongToPlaylist({
    playlistId,
    userId,
    songId,
  }: UpdatePlaylistSongRequest) {
    const isPlaylistExist = await this.checkPlaylistExist(userId, playlistId);
    if (!isPlaylistExist) throw new NotFoundException('Playlist không tồn tại');

    try {
      return await this.prismaService.playlist_song.create({
        data: { playlist_id: playlistId, song_id: songId },
      });
    } catch (error) {
      catchPrismaUnique(error, 'Bài hát đã có sẵn trong playlist');
    }
  }

  async removeSongFromPlaylist({
    playlistId,
    userId,
    songId,
  }: UpdatePlaylistSongRequest) {
    const isPlaylistExist = await this.checkPlaylistExist(userId, playlistId);
    if (!isPlaylistExist) throw new NotFoundException('Playlist không tồn tại');

    try {
      return await this.prismaService.playlist_song.delete({
        where: {
          playlist_id_song_id: { playlist_id: playlistId, song_id: songId },
        },
      });
    } catch (error) {
      catchPrismaNotFound(error, 'Bài hát không có trong playlist');
    }
  }
}
