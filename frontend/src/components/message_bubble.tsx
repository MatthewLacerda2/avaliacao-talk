import { Message } from '../services/chatService';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="flex flex-col mb-4">
      <div className="flex items-center mb-1">
        <span className="font-semibold text-gray-800 text-sm">{message.userName}</span>
        <span className="text-gray-500 text-xs ml-2">{formatTime(message.createdAt)}</span>
      </div>
      <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 max-w-xs lg:max-w-md">
        <p className="text-gray-800 text-sm">{message.text}</p>
      </div>
    </div>
  );
}

