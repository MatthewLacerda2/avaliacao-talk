'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessageBubble from '../../components/message_bubble';

interface Message {
  id: number;
  userId: number;
  userName: string;
  text: string;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/');
          return;
        }

        const response = await fetch('http://localhost:3000/chat/messages', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load messages');
        }

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [router]);

  const handleExit = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 shadow-md flex justify-between items-center">
        <h1 className="text-lg font-semibold">Chat</h1>
        <button
          onClick={handleExit}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md transition-colors text-sm font-medium"
        >
          Exit
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            id={message.id}
            username={message.userName}
            text={message.text}
            created_at={message.createdAt}
          />
        ))}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}