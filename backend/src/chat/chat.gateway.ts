import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/ws-jwt.guard';

interface SocketWithUser extends Socket {
  data: {
    user: { userId: string; username: string };
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  @UseGuards(WsJwtGuard)
  async handleMessage(@MessageBody() data: { text: string }, @ConnectedSocket() client: SocketWithUser) {
    const user = client.data.user;
    const message = await this.chatService.createMessage(user.userId, user.username, data.text);

    this.server.emit('newMessage', {
      id: message.id,
      userId: message.userId,
      userName: message.userName,
      text: message.text,
      createdAt: message.createdAt,
    });

    return { success: true };
  }
}
