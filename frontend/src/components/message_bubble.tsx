interface MessageBubbleProps {
  id: number;
  username: string;
  text: string;
  created_at: string;
}

export default function MessageBubble({ id, username, text, created_at }: MessageBubbleProps) {
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
        <span className="font-semibold text-gray-800 text-sm">{username}</span>
        <span className="text-gray-500 text-xs ml-2">{formatTime(created_at)}</span>
      </div>
      <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 max-w-xs lg:max-w-md">
        <p className="text-gray-800 text-sm">{text}</p>
      </div>
    </div>
  );
}

