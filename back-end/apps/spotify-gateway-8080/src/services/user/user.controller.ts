import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppGuard } from '@app/shared/guards/app.guard';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { UserInReq } from '@app/shared/types/shared.type';
import { UserService } from './user.service';

@UseGuards(AppGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getUserProfile(@CurrentUser() { user_id }: UserInReq) {
    return this.userService.getUserProfile(user_id);
  }
}
