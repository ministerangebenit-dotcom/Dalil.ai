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
    <div className={`flex gap-3 mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Bot size={15} className="text-white" />
        </div>
      )}
      <div className={`${isUser ? 'max-w-[75%]' : 'flex-1 min-w-0'}`}>
        {isUser ? (
          <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm">
            {message.content}
          </div>
        ) : (
          <ProceduralAnswer data={message.content} />
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-[var(--dalil-surface)] border border-border flex items-center justify-center shrink-0 mt-0.5">
          <User size={14} className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
