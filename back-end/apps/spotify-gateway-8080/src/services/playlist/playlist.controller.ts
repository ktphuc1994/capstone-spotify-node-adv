import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AppGuard } from '@app/shared/guards/app.guard';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { UserInReq } from '@app/shared/types/shared.type';
import {
  CreatePlaylistRequest,
  UpdatePlaylistRequest,
  UpdatePlaylistSongRequest,
} from '@app/shared/schema/playlist.schema';
import { EnhancedParseIntPipe } from '@app/shared/pipes/parse-int.pipe';
import { PlaylistService } from './playlist.service';

@UseGuards(AppGuard)
@Controller('playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Get()
  getPlaylist(@CurrentUser() { user_id }: UserInReq) {
    return this.playlistService.getPlaylist(user_id);
  }

  @Post()
  createPlaylist(
    @CurrentUser() { user_id }: UserInReq,
    @Body() createInfo: Omit<CreatePlaylistRequest, 'userId'>,
  ) {
    return this.playlistService.createPlaylist({
      ...createInfo,
      userId: user_id,
    });
  }

  @Put(':playlistId')
  updatePlaylist(
    @CurrentUser() { user_id }: UserInReq,
    @Param('playlistId', EnhancedParseIntPipe) playlistId: number,
    @Body() updateInfo: Omit<UpdatePlaylistRequest, 'userId' | 'playlistId'>,
  ) {
    return this.playlistService.updatePlaylist({
      ...updateInfo,
      userId: user_id,
      playlistId,
    });
  }

  @Delete(':playlistId')
  removePlaylist(
    @CurrentUser() { user_id }: UserInReq,
    @Param('playlistId', EnhancedParseIntPipe) playlistId: number,
  ) {
    return this.playlistService.removePlaylist(user_id, playlistId);
  }

  @Get(':playlistId')
  getPlaylistDetail(
    @CurrentUser() { user_id }: UserInReq,
    @Param('playlistId', EnhancedParseIntPipe) playlistId: number,
  ) {
    return this.playlistService.getPlaylistDetail(user_id, playlistId);
  }

  @Post(':playlistId/song')
  addSongToPlaylist(
    @CurrentUser() { user_id }: UserInReq,
    @Param('playlistId', EnhancedParseIntPipe) playlistId: number,
    @Body() { songId }: Pick<UpdatePlaylistSongRequest, 'songId'>,
  ) {
    return this.playlistService.addSongToPlaylist({
      songId,
      userId: user_id,
      playlistId,
    });
  }

  @Delete(':playlistId/song')
  removeSongFromPlaylist(
    @CurrentUser() { user_id }: UserInReq,
    @Param('playlistId', EnhancedParseIntPipe) playlistId: number,
    @Body() { songId }: Pick<UpdatePlaylistSongRequest, 'songId'>,
  ) {
    return this.playlistService.removeSongFromPlaylist({
      songId,
      userId: user_id,
      playlistId,
    });
  }
}
