import { PrismaService } from '@app/shared/prisma/prisma.service';
import { UserProfile, userProfileSchema } from '@app/shared/schema/user.schema';
import { Playlist, PlaylistInfo } from '@app/shared/types/song.type';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserProfile(user_id: number): Promise<UserProfile> {
    const userInfo = await this.prismaService.user.findFirst({
      where: { user_id },
    });
    if (!userInfo) throw new NotFoundException('Người dùng không tồn tại.');

    try {
      return userProfileSchema.parse(userInfo);
    } catch (_error) {
      throw new ConflictException(
        'Có sự sai lệnh trong dữ liệu thông tin người dùng. Vui lòng liên hệ chăm sóc khách hàng để được hỗ trợ.',
      );
    }
  }

  async getPlaylist(user_id: number): Promise<Omit<Playlist, 'user_id'>[]> {
    return this.prismaService.playlist.findMany({
      where: { user_id },
      select: { playlist_id: true, playlist_name: true, playlist_cover: true },
    });
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
}
