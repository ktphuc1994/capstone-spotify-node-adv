import { AUTH_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { AUTH_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import { UserInReq } from '@app/shared/types/shared.type';
import { extractTokenFromHeader } from '@app/shared/utils/auth';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { lastValueFrom } from 'rxjs';
import { Socket, Server } from 'socket.io';
import { ChatService } from '../services/chat.service';
import {
  TAG_GET_ALL_CONVERSATION,
  TAG_GET_NEW_MESSAGE,
  TAG_SEND_MESSAGE,
} from '../constants/tags';
import { MessageRequest, messageRequestSchema } from '../schema/chat.schema';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';
import { PresenceService } from '../services/presence.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConversationUser } from '../types/ActiveUser.type';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly authMicroService: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly presenceService: PresenceService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  private server!: Server;

  async handleDisconnect(socket: Socket) {
    console.log('HANDLE DISCONNECT - CHAT');
    const userInfo = socket.data?.user as UserInReq | undefined;
    if (userInfo) {
      await this.cacheManager.del(`conversationUser ${userInfo.user_id}`);
    }
    socket.disconnect();
  }

  async handleConnection(socket: Socket) {
    console.log('HANDLE CONNECTION - CHAT');

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

    await this.setConversationUser(socket);
    await this.getAllConversations(socket);
  }

  private async setConversationUser(socket: Socket) {
    const user = socket.data?.user as UserInReq | undefined;
    if (!user) return;

    const conversationUser = { id: user.user_id, socketId: socket.id };
    await this.cacheManager.set(
      `conversationUser ${user.user_id}`,
      conversationUser,
    );
  }

  private async getConversationUser(user_id: number) {
    const activeUser = await this.presenceService.getActiveUser(user_id);
    if (!activeUser?.isActive) return;

    return await this.cacheManager.get<ConversationUser>(
      `conversationUser ${activeUser.id}`,
    );
  }

  @SubscribeMessage(TAG_GET_ALL_CONVERSATION)
  async getAllConversations(socket: Socket) {
    const userInfo = socket.data?.user as UserInReq | undefined;

    if (!userInfo) throw new WsException('Unauthorization');

    const conversations = await this.chatService.getAllConversations(
      userInfo.user_id,
    );

    this.server.to(socket.id).emit(TAG_GET_ALL_CONVERSATION, conversations);
  }

  @SubscribeMessage(TAG_SEND_MESSAGE)
  async handleMessage(
    @MessageBody(new ZodValidationPipe(messageRequestSchema, 'ws'))
    messageRequest: MessageRequest,
    @ConnectedSocket() socket: Socket,
  ) {
    const userInfo = socket.data?.user as UserInReq | undefined;
    if (!userInfo) throw new WsException('Unauthorization');

    if (!messageRequest) throw new WsException('Payload là bắt buộc');

    const createdMessage = await this.chatService.createMessage(
      userInfo.user_id,
      messageRequest,
    );

    const userInConversation = await this.chatService.getUserInConversation(
      messageRequest.conversationId,
    );
    const friendId = userInConversation.find(
      (userId) => userId !== userInfo.user_id,
    );
    if (!friendId) return;

    const conversationFriend = await this.getConversationUser(friendId);
    if (!conversationFriend) return;

    this.server
      .to(conversationFriend.socketId)
      .emit(TAG_GET_NEW_MESSAGE, createdMessage);
  }
}
