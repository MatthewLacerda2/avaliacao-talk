import { CanActivate, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

interface WsContext {
  switchToWs(): { getClient(): Socket };
}

interface JwtPayload {
  sub: string;
  username: string;
}

interface SocketWithUser extends Socket {
  data: {
    user: { userId: string; username: string };
  };
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: WsContext): boolean {
    const client = context.switchToWs().getClient() as SocketWithUser;
    const token = (client.handshake.auth.token ||
      client.handshake.headers.authorization?.replace('Bearer ', '')) as string;

    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const payload = this.jwtService.verify(token) as JwtPayload;
      client.data.user = { userId: payload.sub, username: payload.username };
      return true;
    } catch {
      throw new WsException('Unauthorized');
    }
  }
}
