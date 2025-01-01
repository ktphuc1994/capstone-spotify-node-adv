import { Controller, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import {
  CreateFriendRequest,
  createFriendRequestSchema,
  FriendListRequest,
  friendListRequestSchema,
  UpdateFriendRequest,
  updateFriendRequestSchema,
} from '@app/shared/schema/user.schema';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERN.PROFILE)
  getUserProfile(@Payload() userId: number) {
    return this.userService.getUserProfile(userId);
  }

  @MessagePattern(USER_PATTERN.GET_FRIEND_LIST)
  @UsePipes(new ZodValidationPipe(friendListRequestSchema))
  getFriendList(@Payload() requestInfo: FriendListRequest) {
    return this.userService.getFriendList(requestInfo);
  }

  @MessagePattern(USER_PATTERN.GET_REQUESTED_FRIEND_LIST)
  @UsePipes(new ZodValidationPipe(friendListRequestSchema))
  getRequestedFriendList(@Payload() requestInfo: FriendListRequest) {
    return this.userService.getRequestedFriendList(requestInfo);
  }

  @MessagePattern(USER_PATTERN.GET_RECEIVED_FRIEND_LIST)
  @UsePipes(new ZodValidationPipe(friendListRequestSchema))
  getReceivedFriendList(@Payload() requestInfo: FriendListRequest) {
    return this.userService.getReceivedFriendList(requestInfo);
  }

  @MessagePattern(USER_PATTERN.SEND_FRIEND_REQUEST)
  @UsePipes(new ZodValidationPipe(createFriendRequestSchema))
  sendFriendRequest(@Payload() requestInfo: CreateFriendRequest) {
    return this.userService.sendFriendRequest(
      requestInfo.userId,
      requestInfo.friendId,
    );
  }

  @MessagePattern(USER_PATTERN.ACCEPT_FRIEND_REQUEST)
  @UsePipes(new ZodValidationPipe(updateFriendRequestSchema))
  acceptFriendRequest(@Payload() requestInfo: UpdateFriendRequest) {
    return this.userService.acceptFriendRequest(
      requestInfo.userId,
      requestInfo.friendListId,
    );
  }

  @MessagePattern(USER_PATTERN.REMOVE_FRIEND)
  @UsePipes(new ZodValidationPipe(updateFriendRequestSchema))
  removeFriend(@Payload() requestInfo: UpdateFriendRequest) {
    return this.userService.removeFriend(
      requestInfo.userId,
      requestInfo.friendListId,
    );
  }
}
