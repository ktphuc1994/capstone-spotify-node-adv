import { USER_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { USER_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import {
  CreateFriendRequest,
  FriendListRequest,
  UpdateFriendRequest,
  User,
} from '@app/shared/schema/user.schema';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_SERVICE_NAME) private userMicroservice: ClientProxy,
  ) {}

  getUserProfile(userId: number): Observable<User> {
    return this.userMicroservice.send<User>(USER_PATTERN.PROFILE, userId);
  }

  getFriendList(requestInfo: FriendListRequest) {
    return this.userMicroservice.send(
      USER_PATTERN.GET_FRIEND_LIST,
      requestInfo,
    );
  }

  getRequestedFriendList(requestInfo: FriendListRequest) {
    return this.userMicroservice.send(
      USER_PATTERN.GET_REQUESTED_FRIEND_LIST,
      requestInfo,
    );
  }

  getReceivedFriendList(requestInfo: FriendListRequest) {
    return this.userMicroservice.send(
      USER_PATTERN.GET_RECEIVED_FRIEND_LIST,
      requestInfo,
    );
  }

  sendFriendRequest(requestInfo: CreateFriendRequest) {
    return this.userMicroservice.send(
      USER_PATTERN.SEND_FRIEND_REQUEST,
      requestInfo,
    );
  }

  acceptFriendRequest(requestInfo: UpdateFriendRequest) {
    return this.userMicroservice.send(
      USER_PATTERN.ACCEPT_FRIEND_REQUEST,
      requestInfo,
    );
  }

  removeFriend(requestInfo: UpdateFriendRequest) {
    return this.userMicroservice.send(USER_PATTERN.REMOVE_FRIEND, requestInfo);
  }
}
