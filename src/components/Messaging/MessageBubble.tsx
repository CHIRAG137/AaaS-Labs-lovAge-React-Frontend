
import React from 'react';

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isSentByMe: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, timestamp, isSentByMe }) => {
  return (
    <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] ${
          isSentByMe 
            ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-none' 
            : 'bg-secondary rounded-2xl rounded-tl-none'
        } px-4 py-3 shadow-sm`}
      >
        <p className="text-base mb-1">{content}</p>
        <p className="text-xs opacity-70 text-right">{timestamp}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
