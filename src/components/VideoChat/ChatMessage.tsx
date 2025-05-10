
import React from 'react';

interface ChatMessageProps {
  content: string;
  timestamp: string;
  isSentByMe: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, timestamp, isSentByMe }) => {
  return (
    <div className={`max-w-[90%] ${
      isSentByMe 
        ? 'ml-auto bg-primary text-primary-foreground' 
        : 'bg-secondary'
      } rounded-xl p-3 mb-2`}
    >
      <p className="text-sm">{content}</p>
      <p className="text-xs opacity-70 text-right mt-1">{timestamp}</p>
    </div>
  );
};

export default ChatMessage;
