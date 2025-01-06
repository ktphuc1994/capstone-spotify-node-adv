import {
  AUTH_PATTERN,
  USER_PATTERN,
} from '@app/shared/constants/microservice-pattern.const';
import {
  AUTH_SERVICE_NAME,
  USER_SERVICE_NAME,
} from '@app/shared/constants/microservice.const';
import { UserInReq } from '@app/shared/types/shared.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ActiveUser } from '../types/ActiveUser.type';
import { FriendList } from '@app/shared/schema/user.schema';
import { TAG_ACTIVE_FRIEND, TAG_UPDATE_ACTIVE_STATUS } from '../constants/tags';
import { extractTokenFromHeader } from '@app/shared/utils/auth';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/presence' })
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly authMicroService: ClientProxy,
    @Inject(USER_SERVICE_NAME) private readonly userMicroService: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @WebSocketServer()
  private server!: Server;

  private async getFriendList(userId: number) {
    try {
      return await lastValueFrom<FriendList[]>(
        this.userMicroService.send(USER_PATTERN.GET_FRIEND_LIST, {
          userId,
          page: '1',
          pageSize: '9999',
        }),
      );
    } catch (error) {
      console.log('Get friend list error: ', error);
      return [];
    }
  }

  private async emitStatusToFriends(activeUser: ActiveUser) {
    const friendList = await this.getFriendList(activeUser.id);

    for (const f of friendList) {
      const friend = await this.cacheManager.get<ActiveUser>(
        `user ${f.friendInfo.user_id}`,
      );

      // user may not logged into application before. Just skip
      if (!friend) continue;

      this.server.to(friend.socketId).emit(TAG_ACTIVE_FRIEND, {
        id: activeUser.id,
        isActive: activeUser.isActive,
      });

      if (activeUser.isActive) {
        this.server.to(activeUser.socketId).emit(TAG_ACTIVE_FRIEND, {
          id: friend.id,
          isActive: friend.isActive,
        });
      }
    }
  }

  private async setActiveStatus(socket: Socket, isActive: boolean) {
    const userInfo = socket.data?.user as UserInReq;
    if (!userInfo) return;

    const activeUser: ActiveUser = {
      id: userInfo.user_id,
      socketId: socket.id,
      isActive,
    };

    await this.cacheManager.set(`user ${userInfo.user_id}`, activeUser);
    await this.emitStatusToFriends(activeUser);
  }

  async handleDisconnect(socket: Socket) {
    console.log('HANDLE DISCONNECT');
    socket.disconnect();
    this.setActiveStatus(socket, false);
  }

  async handleConnection(socket: Socket) {
    console.log('HANDLE CONNECTION');

    // get auth jwt
    const jwt = extractTokenFromHeader(socket.handshake.headers?.authorization);
    if (!jwt) throw new WsException('Unauthorization');

    let userInfo: UserInReq | null = null;
    try {
      userInfo = await lastValueFrom<UserInReq>(
        this.authMicroService.send(AUTH_PATTERN.AUTHEN, {
          jwt,
        }),
      );
    } catch (error) {}
    if (!userInfo) throw new WsException('Invalid credential');

    socket.data.user = userInfo;
    await this.setActiveStatus(socket, true);
  }

  @SubscribeMessage(TAG_UPDATE_ACTIVE_STATUS)
  async updateActiveStatus(socket: Socket, isActive: boolean) {
    if (!socket.data?.user) throw new WsException('Unauthorization');

    if (typeof isActive !== 'boolean')
      throw new WsException('Trạng thái đăng nhập phải là boolean');

    await this.setActiveStatus(socket, isActive);
  }
}
