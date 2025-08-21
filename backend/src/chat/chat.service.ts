import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async createMessage(userId: string, userName: string, text: string): Promise<ChatMessage> {
    const message = this.chatMessageRepository.create({ userId, userName, text });
    return this.chatMessageRepository.save(message);
  }

  async getLatestMessages(limit: number = 50): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      select: ['id', 'userId', 'userName', 'text', 'createdAt'],
    });
  }
}
