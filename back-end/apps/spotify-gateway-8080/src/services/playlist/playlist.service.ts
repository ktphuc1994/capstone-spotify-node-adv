import { PLAYLIST_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { PLAYLIST_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import {
  CreatePlaylistRequest,
  UpdatePlaylistRequest,
  UpdatePlaylistSongRequest,
} from '@app/shared/schema/playlist.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PlaylistService {
  constructor(
    @Inject(PLAYLIST_SERVICE_NAME) private playlistMicroservice: ClientProxy,
  ) {}

  getPlaylist(userId: number) {
    return this.playlistMicroservice.send(
      PLAYLIST_PATTERN.PLAYLIST_GET,
      userId,
    );
  }

  createPlaylist(createRequest: CreatePlaylistRequest) {
    return this.playlistMicroservice.send(
      PLAYLIST_PATTERN.PLAYLIST_CREATE,
      createRequest,
    );
  }

  updatePlaylist(updateRequest: UpdatePlaylistRequest) {
    return this.playlistMicroservice.send(
      PLAYLIST_PATTERN.PLAYLIST_UPDATE,
      updateRequest,
    );
  }

  removePlaylist(userId: number, playlistId: number) {
    return this.playlistMicroservice.send(PLAYLIST_PATTERN.PLAYLIST_REMOVE, {
      playlistId,
      userId,
    });
  }

  getPlaylistDetail(userId: number, playlistId: number) {
    return this.playlistMicroservice.send(
      PLAYLIST_PATTERN.PLAYLIST_GET_DETAIL,
      {
        playlistId,
        userId,
      },
    );
  }

  addSongToPlaylist(addSongRequest: UpdatePlaylistSongRequest) {
    return this.playlistMicroservice.send(
      PLAYLIST_PATTERN.PLAYLIST_ADD_SONG,
      addSongRequest,
    );
  }

  removeSongFromPlaylist(removeSongRequest: UpdatePlaylistSongRequest) {
    return this.playlistMicroservice.send(
      PLAYLIST_PATTERN.PLAYLIST_REMOVE_SONG,
      removeSongRequest,
    );
  }
}
