'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { chatService, Message } from '../../services/chatService';
import { MessageBubble } from '../../components/message_bubble';
import { ToastContainer, ToastNotification } from '../../components/toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const router = useRouter();

  const addToast = (message: string, type: 'join' | 'leave') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastNotification = { id, message, type };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/');
          return;
        }

        const initialMessages = await chatService.loadMessages(token);
        setMessages(initialMessages);

        const connected = await chatService.connect(
          token, 
          (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
          },
          (userEvent) => {
            const message = userEvent.type === 'join' 
              ? `${userEvent.data.username} joined the chat`
              : `${userEvent.data.username} left the chat`;
            addToast(message, userEvent.type);
          }
        );

        setIsConnected(connected);
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [router]);

  const sendMessage = () => {
    if (!messageText.trim()) return;

    const sent = chatService.sendMessage(messageText);
    if (sent) {
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Chat Room</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                chatService.disconnect();
                router.push('/');
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {/* Input */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !messageText.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}