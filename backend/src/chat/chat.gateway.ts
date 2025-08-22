import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
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
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    // Connection is handled by the guard, but we need to wait for authentication
    // The actual userJoined event will be sent via the userJoined message handler
  }

  handleDisconnect(client: SocketWithUser) {
    if (client.data?.user) {
      // Emit user left notification to all connected clients
      this.server.emit('userLeft', {
        userId: client.data.user.userId,
        username: client.data.user.username,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @SubscribeMessage('sendMessage')
  @UseGuards(WsJwtGuard)
  async handleMessage(@MessageBody() data: { text: string }, @ConnectedSocket() client: SocketWithUser) {
    const user = client.data.user;
    console.log(`Message from ${user.username}: ${data.text}`);
    
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

  @SubscribeMessage('userJoined')
  @UseGuards(WsJwtGuard)
  async handleUserJoined(@ConnectedSocket() client: SocketWithUser) {
    const user = client.data.user;
    
    console.log(`User joined: ${user.username} (${user.userId})`);
    
    // Emit user joined notification to all connected clients
    this.server.emit('userJoined', {
      userId: user.userId,
      username: user.username,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  }
}
