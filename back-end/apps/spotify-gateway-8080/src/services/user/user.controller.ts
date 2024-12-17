import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppGuard } from '@app/shared/guards/app.guard';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { UserInReq } from '@app/shared/types/shared.type';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @UseGuards(AppGuard)
  getUserProfile(@CurrentUser() userInfo: UserInReq) {
    console.log(userInfo);
    return this.userService.getUserProfile(userInfo.user_id);
  }
}
