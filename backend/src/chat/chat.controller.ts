import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateMessageDto {
  text: string;
}

interface RequestWithUser extends Request {
  user: { userId: string; username: string };
}

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('messages')
  async getMessages() {
    return this.chatService.getLatestMessages(50);
  }

  @Post('messages')
  async createMessage(@Body() createMessageDto: CreateMessageDto, @Request() req: RequestWithUser) {
    const { userId, username } = req.user;
    return this.chatService.createMessage(userId, username, createMessageDto.text);
  }
}
