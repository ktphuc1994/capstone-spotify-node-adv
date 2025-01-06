import { CHAT_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { CHAT_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_SERVICE_NAME) private chatMicroservice: ClientProxy,
  ) {}

  getConversationByFriend(userId: number, friendId: number) {
    return this.chatMicroservice.send(
      CHAT_PATTERN.CHAT_GET_CONVERSATION_BY_FRIEND,
      { userId, friendId },
    );
  }
}
