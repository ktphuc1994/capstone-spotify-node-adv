import { Controller, UsePipes } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CHAT_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import {
  MessageByFriendRequest,
  messageByFriendRequestSchema,
} from '../schema/chat.schema';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern(CHAT_PATTERN.CHAT_GET_CONVERSATION_BY_FRIEND)
  @UsePipes(new ZodValidationPipe(messageByFriendRequestSchema))
  getConversationByFriend(
    @Payload() { friendId, userId }: MessageByFriendRequest,
  ) {
    return this.chatService.getConversationByFriend(userId, friendId);
  }
}
