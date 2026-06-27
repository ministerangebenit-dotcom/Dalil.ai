import { useState, useRef, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { ChatMessage } from './components/chat/ChatMessage';
import { mockFetchResponse } from './data/mock-responses';
import { Bot, Globe, Shield, BookOpen, Building2 } from 'lucide-react';
import './index.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: any;
}

const suggestions = [
  { icon: Building2, text: 'How do I register a company in Cameroon?', color: 'text-blue-600' },
  { icon: Shield, text: 'What are the cybercrime laws in Cameroon?', color: 'text-emerald-600' },
  { icon: BookOpen, text: 'How to obtain a building permit in Yaoundé?', color: 'text-violet-600' },
  { icon: Globe, text: 'What taxes apply to Cameroonian SMEs?', color: 'text-amber-600' },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (query: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockFetchResponse(query),
      }]);
      setIsTyping(false);
    }, 2200);
  };

  const isEmpty = messages.length === 0;

  return (
    <main className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-white to-blue-50/30">
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-[var(--dalil-surface)] shrink-0">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-none">Dalil</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Cameroon Knowledge Engine</p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">Domains</p>
          {[
            { label: 'Legal & Administrative', icon: '⚖️' },
            { label: 'Business & Finance', icon: '💼' },
            { label: 'Health & Social', icon: '🏥' },
            { label: 'Education', icon: '📚' },
            { label: 'Digital & Tech', icon: '🖥️' },
            { label: 'Agriculture', icon: '🌾' },
          ].map(d => (
            <button key={d.label} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors text-left mb-0.5">
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
            <Globe size={13} className="text-blue-600 shrink-0" />
            <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-snug">Sources: verified Cameroonian domains only</p>
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm">Dalil</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground bg-[var(--dalil-surface)] border border-border px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Indexed: 237 verified Cameroonian sources
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground bg-[var(--dalil-surface)] border border-border px-2.5 py-1 rounded-full font-mono">Beta</span>
          </div>
        </header>

       <main className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-white to-blue-50/30">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center min-h-full px-6 py-16">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                <Bot size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-center mb-2">What do you want to know?</h1>
              <p className="text-muted-foreground text-center text-sm mb-10 max-w-sm">
                Dalil answers your questions using only verified Cameroonian sources — laws, official procedures, and government data.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {suggestions.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => handleSend(s.text)}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-[var(--dalil-surface)] hover:border-blue-200 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 dark:hover:border-blue-800 transition-all text-left group"
                  >
                    <s.icon size={16} className={`${s.color} mt-0.5 shrink-0`} />
                    <span className="text-sm text-foreground leading-snug">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-8">
              {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
              {isTyping && (
                <div className="flex gap-3 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot size={15} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1 bg-[var(--dalil-surface)] border border-border rounded-2xl rounded-bl-sm px-5 py-3.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        <div className="border-t border-border bg-background/80 backdrop-blur-sm px-4 py-4 sticky bottom-0">
          <div className="max-w-3xl mx-auto">
            <SearchBar onSend={handleSend} disabled={isTyping} />
            <p className="text-[11px] text-muted-foreground text-center mt-2.5">
              Dalil only searches verified Cameroonian sources — no foreign results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
