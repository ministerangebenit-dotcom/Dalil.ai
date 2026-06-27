import { useState, useRef, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { ChatMessage } from './components/chat/ChatMessage';
import { mockFetchResponse } from './data/mock-responses';
import { Bot, Globe, Shield, BookOpen, Building2, Cpu, Lock } from 'lucide-react';
import './index.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: any;
}

const suggestions = [
  { icon: Building2, text: 'How do I register a company in Cameroon?', label: 'Business' },
  { icon: Shield, text: 'What are the cybercrime laws in Cameroon?', label: 'Legal' },
  { icon: BookOpen, text: 'How to obtain a building permit in Yaoundé?', label: 'Administrative' },
  { icon: Globe, text: 'What taxes apply to Cameroonian SMEs?', label: 'Finance' },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scanningText, setScanningText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scanningMessages = [
    'Scanning 42 official .cm domains...',
    'Filtering global hallucinations against Cameroonian Law...',
    'Verifying against minpostel.gov.cm...',
    'Cross-referencing with official government gazettes...',
    'Sovereign knowledge retrieval complete.',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTyping) { setScanningText(''); return; }
    let i = 0;
    setScanningText(scanningMessages[0]);
    const interval = setInterval(() => {
      i = (i + 1) % scanningMessages.length;
      setScanningText(scanningMessages[i]);
    }, 440);
    return () => clearInterval(interval);
  }, [isTyping]);

  const handleSend = (query: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: query }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockFetchResponse(query),
      }]);
      setIsTyping(false);
    }, 2600);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:flex flex-col w-60 border-r border-[var(--glass-border)] bg-[rgba(3,43,34,0.8)] backdrop-blur-xl shrink-0">
        <div className="p-5 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--gold-dim)] border border-[var(--gold-border)] flex items-center justify-center">
              <Bot size={16} className="gold-text" />
            </div>
            <div>
              <p className="font-semibold text-sm text-white leading-none">Dalil</p>
              <p className="text-[10px] text-emerald-400 mt-1 font-medium tracking-wide">SOVEREIGN ENGINE</p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-3 px-1">Domains</p>
          {[
            { label: 'Legal & Administrative', icon: '⚖️' },
            { label: 'Business & Finance', icon: '💼' },
            { label: 'Health & Social', icon: '🏥' },
            { label: 'Education', icon: '📚' },
            { label: 'Digital & Cybersecurity', icon: '🔐' },
            { label: 'Agriculture', icon: '🌾' },
          ].map(d => (
            <button key={d.label} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-[hsl(var(--muted-foreground))] hover:bg-[var(--glass-bg)] hover:text-white transition-all text-left mb-0.5">
              <span className="text-base leading-none">{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-[var(--glass-border)] space-y-2">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)]">
            <Lock size={11} className="text-emerald-400 shrink-0" />
            <p className="text-[10px] text-emerald-400 leading-snug font-medium">Data processed locally<br/>Zero foreign dependency</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--gold-dim)] border border-[var(--gold-border)]">
            <Cpu size={11} className="gold-text shrink-0" />
            <p className="text-[10px] gold-text leading-snug font-medium">237 verified .cm sources<br/>indexed and active</p>
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between px-5 py-3 border-b border-[var(--glass-border)] glass sticky top-0 z-10">
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-lg bg-[var(--gold-dim)] border border-[var(--gold-border)] flex items-center justify-center">
              <Bot size={13} className="gold-text" />
            </div>
            <span className="font-semibold text-sm text-white">Dalil</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="pulse-dot" />
            <span className="text-xs text-emerald-400 font-medium">
              {isTyping ? <span className="scanning-text">{scanningText}</span> : 'Sovereign retrieval active'}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="sovereign-badge">
              <Shield size={9} />
              Sovereign Mode
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center min-h-full px-6 py-16">
              <div className="w-16 h-16 rounded-2xl bg-[var(--gold-dim)] border border-[var(--gold-border)] flex items-center justify-center mb-6">
                <Bot size={30} className="gold-text" />
              </div>
              <h1 className="text-3xl font-thin text-white text-center mb-3 tracking-tight">
                Ask anything about<br /><span className="gold-text font-normal">Cameroon</span>
              </h1>
              <p className="text-[hsl(var(--muted-foreground))] text-center text-sm mb-3 max-w-sm leading-relaxed">
                Dalil retrieves answers exclusively from verified Cameroonian sources — laws, official procedures, and government repositories.
              </p>
              <div className="sovereign-badge mb-10">
                <Shield size={9} />
                No foreign AI hallucinations
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map(s => (
                  <button
                    key={s.text}
                    onClick={() => handleSend(s.text)}
                    className="glass-card flex items-start gap-3 p-4 text-left hover:border-[var(--gold-border)] transition-all group"
                  >
                    <s.icon size={15} className="gold-text mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))] mb-1 uppercase tracking-wider">{s.label}</p>
                      <p className="text-sm text-white leading-snug">{s.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-8">
              {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
              {isTyping && (
                <div className="flex gap-3 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-[var(--gold-dim)] border border-[var(--gold-border)] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} className="gold-text" />
                  </div>
                  <div className="glass-card flex flex-col gap-2 px-5 py-4">
                    <span className="scanning-text">{scanningText}</span>
                    <div className="flex items-center gap-1.5">
                      {[0, 150, 300].map(d => (
                        <span key={d} className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] opacity-60 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        <div className="border-t border-[var(--glass-border)] glass px-4 py-4 sticky bottom-0">
          <div className="max-w-3xl mx-auto">
            <SearchBar onSend={handleSend} disabled={isTyping} />
            <p className="text-[10px] text-[hsl(var(--muted-foreground))] text-center mt-2.5 tracking-wide">
              DALIL · CAMEROON SOVEREIGN KNOWLEDGE ENGINE · .CM SOURCES ONLY
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
