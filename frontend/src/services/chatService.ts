const API_BASE_URL = 'http://localhost:3000';
const WS_BASE_URL = 'ws://localhost:3000';

export interface Message {
  id: number;
  userId: number;
  userName: string;
  text: string;
  createdAt: string;
}

export interface UserEvent {
  userId: string;
  username: string;
  timestamp: string;
}

export class ChatService {
  private ws: WebSocket | null = null;
  private onMessageCallback: ((message: Message) => void) | null = null;
  private onUserEventCallback: ((event: { type: 'join' | 'leave'; data: UserEvent }) => void) | null = null;

  async loadMessages(token: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/chat/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load messages');
    }

    return response.json();
  }

  connect(token: string, onMessage: (message: Message) => void, onUserEvent?: (event: { type: 'join' | 'leave'; data: UserEvent }) => void): Promise<boolean> {
    return new Promise((resolve) => {
      this.onMessageCallback = onMessage;
      this.onUserEventCallback = onUserEvent || null;
      
      // Create WebSocket connection with token in query params (simpler approach)
      this.ws = new WebSocket(`${WS_BASE_URL}?token=${token}`);

      this.ws.onopen = () => {
        // Send userJoined event when connection is established
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            event: 'userJoined',
            data: {}
          }));
        }
        resolve(true);
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event === 'newMessage' && this.onMessageCallback) {
          this.onMessageCallback(data.data);
        } else if (data.event === 'userJoined' && this.onUserEventCallback) {
          this.onUserEventCallback({ type: 'join', data: data.data });
        } else if (data.event === 'userLeft' && this.onUserEventCallback) {
          this.onUserEventCallback({ type: 'leave', data: data.data });
        }
      };

      this.ws.onerror = () => {
        resolve(false);
      };
    });
  }

  sendMessage(text: string): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    this.ws.send(JSON.stringify({
      event: 'sendMessage',
      data: { text }
    }));

    return true;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const chatService = new ChatService();
