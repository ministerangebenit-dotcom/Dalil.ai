import { ProceduralAnswer } from './ProceduralAnswer';
import { User, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: any;
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
          <Bot size={16} />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? 'order-1' : ''}`}>
        {isUser ? (
          <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-br-sm text-gray-800">
            {message.content}
          </div>
        ) : (
          <div className="w-full">
            <ProceduralAnswer data={message.content} />
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
          <User size={16} />
        </div>
      )}
    </div>
  );
}
