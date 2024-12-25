import { Controller, UsePipes } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PLAYLIST_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';
import { EnhancedParseIntPipe } from '@app/shared/pipes/parse-int.pipe';
import {
  CreatePlaylistRequest,
  createPlaylistRequestSchema,
  PlaylistRequest,
  playlistRequestSchema,
  UpdatePlaylistRequest,
  updatePlaylistRequestSchema,
  UpdatePlaylistSongRequest,
  updatePlaylistSongRequestSchema,
} from '@app/shared/schema/playlist.schema';

@Controller()
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @MessagePattern(PLAYLIST_PATTERN.PLAYLIST_GET)
  @UsePipes(EnhancedParseIntPipe)
  getPlaylist(@Payload() userId: number) {
    return this.playlistService.getPlaylist(userId);
  }

  @MessagePattern(PLAYLIST_PATTERN.PLAYLIST_CREATE)
  @UsePipes(new ZodValidationPipe(createPlaylistRequestSchema))
  createPlaylist(@Payload() createRequest: CreatePlaylistRequest) {
    return this.playlistService.createPlaylist(createRequest);
  }

  @MessagePattern(PLAYLIST_PATTERN.PLAYLIST_UPDATE)
  @UsePipes(new ZodValidationPipe(updatePlaylistRequestSchema))
  updatePlaylist(@Payload() updateRequest: UpdatePlaylistRequest) {
    return this.playlistService.updatePlaylist(updateRequest);
  }

  @MessagePattern(PLAYLIST_PATTERN.PLAYLIST_REMOVE)
  @UsePipes(new ZodValidationPipe(playlistRequestSchema))
  removePlaylist(@Payload() removeRequest: PlaylistRequest) {
    return this.playlistService.removePlaylist(
      removeRequest.userId,
      removeRequest.playlistId,
    );
  }

  @MessagePattern(PLAYLIST_PATTERN.PLAYLIST_GET_DETAIL)
  @UsePipes(new ZodValidationPipe(playlistRequestSchema))
  getPlaylistDetail(
    @Payload()
    playlistRequest: PlaylistRequest,
  ) {
    return this.playlistService.getPlaylistDetail(
      playlistRequest.userId,
      playlistRequest.playlistId,
    );
  }

  @MessagePattern(PLAYLIST_PATTERN.PLAYLIST_ADD_SONG)
  @UsePipes(new ZodValidationPipe(updatePlaylistSongRequestSchema))
  addSongToPlaylist(@Payload() requestInfo: UpdatePlaylistSongRequest) {
    return this.playlistService.addSongToPlaylist(requestInfo);
  }

  @MessagePattern(PLAYLIST_PATTERN.PLAYLIST_REMOVE_SONG)
  @UsePipes(new ZodValidationPipe(updatePlaylistSongRequestSchema))
  removeSongFromPlaylist(@Payload() requestInfo: UpdatePlaylistSongRequest) {
    return this.playlistService.removeSongFromPlaylist(requestInfo);
  }
}
