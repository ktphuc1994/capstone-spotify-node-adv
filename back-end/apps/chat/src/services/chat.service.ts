import { PrismaService } from '@app/shared/prisma/prisma.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MessageRequest } from '../schema/chat.schema';
import { USER_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import { ClientProxy } from '@nestjs/microservices';
import { USER_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(USER_SERVICE_NAME) private readonly userMicroService: ClientProxy,
  ) {}

  private async createConversation(user_id: number, friend_id: number) {
    const existConversation =
      await this.prismaService.user_conversation.findMany({
        where: { OR: [{ user_id }, { user_id: friend_id }] },
      });
    if (existConversation.length === 2)
      return { conversationId: existConversation[0].conversation_id };

    const conversationInfo = await this.prismaService.conversation.create({
      data: {
        user_conversation: {
          createMany: { data: [{ user_id }, { user_id: friend_id }] },
        },
      },
    });
    return { conversationId: conversationInfo.conversation_id };
  }

  async getAllConversations(user_id: number) {
    const allConversations = await this.prismaService.conversation.findMany({
      where: { user_conversation: { some: { user_id } } },
      select: {
        conversation_id: true,
        user_conversation: { select: { user_id: true } },
      },
    });

    return allConversations.map(({ conversation_id, user_conversation }) => {
      const userIds = user_conversation.map((userInfo) => userInfo.user_id);
      return { conversation_id, userIds };
    });
  }

  async getUserInConversation(conversation_id: number) {
    const userList = await this.prismaService.user_conversation.findMany({
      where: { conversation_id },
      select: { user_id: true },
    });

    return userList.map((user) => user.user_id);
  }

  async createMessage(
    user_id: number,
    { conversationId, message }: MessageRequest,
  ) {
    const existConversation = await this.prismaService.conversation.findFirst({
      where: {
        conversation_id: conversationId,
        user_conversation: { some: { user_id } },
      },
    });

    if (!existConversation)
      throw new BadRequestException('Hội thoại không tồn tại');

    return await this.prismaService.message.create({
      data: { message, conversation_id: conversationId, user_id },
    });
  }

  async getConversationMessages(user_id: number, conversation_id: number) {
    const conversationInfo = await this.prismaService.conversation.findFirst({
      where: { conversation_id, user_conversation: { some: { user_id } } },
      select: {
        message: { select: { message_id: true, user_id: true, message: true } },
      },
    });

    if (!conversationInfo)
      throw new BadRequestException('Hội thoại không tồn tại');

    return conversationInfo.message;
  }

  async getConversationByFriend(user_id: number, friend_id: number) {
    const isFriend = await lastValueFrom(
      this.userMicroService.send(USER_PATTERN.CHECK_FRIEND, {
        userId: user_id,
        friendId: friend_id,
      }),
    );
    if (!isFriend)
      throw new BadRequestException('Người dùng không phải là bạn bè');

    const { conversationId } = await this.createConversation(
      user_id,
      friend_id,
    );

    return await this.getConversationMessages(user_id, conversationId);
  }
}
