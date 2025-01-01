import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppGuard } from '@app/shared/guards/app.guard';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { UserInReq } from '@app/shared/types/shared.type';
import { UserService } from './user.service';
import { FriendListRequest } from '@app/shared/schema/user.schema';
import { EnhancedParseIntPipe } from '@app/shared/pipes/parse-int.pipe';

@UseGuards(AppGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getUserProfile(@CurrentUser() { user_id }: UserInReq) {
    return this.userService.getUserProfile(user_id);
  }

  @Get('friend')
  getFriendList(
    @Query() requestInfo: Omit<FriendListRequest, 'userId'>,
    @CurrentUser() { user_id }: UserInReq,
  ) {
    return this.userService.getFriendList({ ...requestInfo, userId: user_id });
  }

  @Get('friend/requested')
  getRequestedFriendList(
    @Query() requestInfo: Omit<FriendListRequest, 'userId'>,
    @CurrentUser() { user_id }: UserInReq,
  ) {
    return this.userService.getRequestedFriendList({
      ...requestInfo,
      userId: user_id,
    });
  }

  @Get('friend/received')
  getReceivedFriendList(
    @Query() requestInfo: Omit<FriendListRequest, 'userId'>,
    @CurrentUser() { user_id }: UserInReq,
  ) {
    return this.userService.getReceivedFriendList({
      ...requestInfo,
      userId: user_id,
    });
  }

  @Post('friend/send/:friendId')
  sendFriendRequest(
    @Param('friendId', EnhancedParseIntPipe) friendId: number,
    @CurrentUser() { user_id }: UserInReq,
  ) {
    return this.userService.sendFriendRequest({ friendId, userId: user_id });
  }

  @Put('friend/accept/:friendListId')
  acceptFriendRequest(
    @Param('friendListId', EnhancedParseIntPipe) friendListId: number,
    @CurrentUser() { user_id }: UserInReq,
  ) {
    return this.userService.acceptFriendRequest({
      friendListId,
      userId: user_id,
    });
  }

  @Delete('friend/:friendListId')
  removeFriend(
    @Param('friendListId', EnhancedParseIntPipe) friendListId: number,
    @CurrentUser() { user_id }: UserInReq,
  ) {
    return this.userService.removeFriend({
      friendListId,
      userId: user_id,
    });
  }
}
