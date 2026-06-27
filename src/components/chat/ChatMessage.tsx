import { useState } from 'react';
import { ProceduralAnswer } from './ProceduralAnswer';
import { User, Bot, Copy, Check } from 'lucide-react';
import type { Language } from '../../lib/i18n';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: any;
  streaming?: boolean;
  streamedSummary?: string;
  relatedQuestions?: string[];
}

interface ChatMessageProps {
  message: Message;
  lang: Language;
  onFollowUp: (q: string) => void;
}

export function ChatMessage({ message, lang, onFollowUp }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = typeof message.content === 'string'
      ? message.content
      : message.content?.summary ?? '';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="msg-avatar gold">
          <Bot size={14} color="#fbbf24" />
        </div>
      )}

      <div className={`msg-body ${isUser ? 'user' : 'assistant'}`}>
        {isUser ? (
          <div className="user-bubble">{message.content}</div>
        ) : (
          <div className="assistant-body">
            {/* Copy button */}
            <div className="msg-actions">
              <button onClick={handleCopy} className="copy-btn" title="Copy">
                {copied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
              </button>
            </div>

            <ProceduralAnswer
              data={message.content}
              lang={lang}
              streaming={message.streaming}
              streamedSummary={message.streamedSummary}
            />

            {/* Related questions — only when done streaming */}
            {!message.streaming && message.relatedQuestions && message.relatedQuestions.length > 0 && (
              <div className="related-questions">
                <p className="related-label">Related</p>
                <div className="related-list">
                  {message.relatedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => onFollowUp(q)}
                      className="related-item"
                    >
                      <span className="related-arrow">→</span>
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="msg-avatar user">
          <User size={13} style={{ color: 'hsl(var(--muted-foreground))' }} />
        </div>
      )}
    </div>
  );
}
