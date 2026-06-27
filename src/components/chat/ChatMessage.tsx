import { ProceduralAnswer } from './ProceduralAnswer';
import { User, Bot } from 'lucide-react';
import type { Language } from '../../lib/i18n';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: any;
}

export function ChatMessage({ message, lang }: { message: Message; lang: Language }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 mb-8 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
          <Bot size={14} color="#fbbf24" />
        </div>
      )}
      <div className={`${isUser ? 'max-w-[75%]' : 'flex-1 min-w-0'}`}>
        {isUser ? (
          <div className="glass-card px-4 py-3 text-sm text-white leading-relaxed">
            {message.content}
          </div>
        ) : (
          <ProceduralAnswer data={message.content} lang={lang} />
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <User size={13} style={{ color: 'hsl(var(--muted-foreground))' }} />
        </div>
      )}
    </div>
  );
}
