import { Controller, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';
import {
  PlaylistRequest,
  playlistRequestSchema,
} from '@app/shared/schema/song.schema';
import { EnhancedParseIntPipe } from '@app/shared/pipes/parse-int.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERN.PROFILE)
  getUserProfile(@Payload() userId: number) {
    return this.userService.getUserProfile(userId);
  }

  @MessagePattern(USER_PATTERN.GET_PLAYLIST)
  @UsePipes(EnhancedParseIntPipe)
  getPlaylist(@Payload() userId: number) {
    return this.userService.getPlaylist(userId);
  }

  @MessagePattern(USER_PATTERN.GET_PLAYLIST_DETAIL)
  @UsePipes(new ZodValidationPipe(playlistRequestSchema))
  getPlaylistDetail(
    @Payload()
    playlistRequest: PlaylistRequest,
  ) {
    return this.userService.getPlaylistDetail(
      playlistRequest.userId,
      playlistRequest.playlistId,
    );
  }
}
