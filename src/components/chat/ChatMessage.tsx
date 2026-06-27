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
        <div className="w-8 h-8 rounded-xl bg-[var(--gold-dim)] border border-[var(--gold-border)] flex items-center justify-center shrink-0 mt-0.5">
          <Bot size={14} className="gold-text" />
        </div>
      )}
      <div className={`${isUser ? 'max-w-[75%]' : 'flex-1 min-w-0'}`}>
        {isUser ? (
          <div className="glass-card px-4 py-3 text-sm text-white leading-relaxed">
            {message.content}
          </div>
        ) : (
          <ProceduralAnswer data={message.content} />
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center shrink-0 mt-0.5">
          <User size={13} className="text-[hsl(var(--muted-foreground))]" />
        </div>
      )}
    </div>
  );
}
