import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AppGuard } from '@app/shared/guards/app.guard';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { UserInReq } from '@app/shared/types/shared.type';
import { UserService } from './user.service';

@UseGuards(AppGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getUserProfile(@CurrentUser() userInfo: UserInReq) {
    console.log(userInfo);
    return this.userService.getUserProfile(userInfo.user_id);
  }

  @Get('playlist')
  getPlaylist(@CurrentUser() { user_id }: UserInReq) {
    return this.userService.getPlaylist(user_id);
  }

  @Get('playlist/:playlistId')
  getPlaylistDetail(
    @CurrentUser() userInfo: UserInReq,
    @Param('playlistId') playlistId: string,
  ) {
    return this.userService.getPlaylistDetail(userInfo.user_id, playlistId);
  }
}
