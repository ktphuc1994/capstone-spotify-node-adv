import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AppGuard } from '@app/shared/guards/app.guard';
import { EnhancedParseIntPipe } from '@app/shared/pipes/parse-int.pipe';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { UserInReq } from '@app/shared/types/shared.type';

@UseGuards(AppGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/conversation/:friendId')
  getConversationByFriend(
    @CurrentUser() { user_id }: UserInReq,
    @Param('friendId', EnhancedParseIntPipe) friendId: number,
  ) {
    return this.chatService.getConversationByFriend(user_id, friendId);
  }
}
