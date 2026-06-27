import { useState, useRef, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { ChatMessage } from './components/chat/ChatMessage';
import { SplashScreen } from './components/SplashScreen';
import { NewsPanel } from './components/NewsPanel';
import { mockFetchResponse } from './data/mock-responses';
import { Bot, Globe, Shield, BookOpen, Building2, Cpu, Lock, Newspaper, EyeOff, Languages } from 'lucide-react';
import type { Language } from './lib/i18n';
import { t, getGreeting } from './lib/i18n';
import './index.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: any;
}

const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'pid', label: 'PID', flag: '🇨🇲' },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scanningText, setScanningText] = useState('');
  const [lang, setLang] = useState<Language>('fr');
  const [showNews, setShowNews] = useState(false);
  const [incognito, setIncognito] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const scanningMessages: string[] = t(lang, 'scanning') as string[];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTyping) { setScanningText(''); return; }
    let i = 0;
    setScanningText(scanningMessages[0]);
    const iv = setInterval(() => { i = (i + 1) % scanningMessages.length; setScanningText(scanningMessages[i]); }, 440);
    return () => clearInterval(iv);
  }, [isTyping, lang]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) setShowLangMenu(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSend = (query: string) => {
    if (incognito) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: query }]);
    } else {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: query }]);
    }
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
  const greeting = getGreeting(lang);
  const greetingSub = t(lang, 'greeting_sub') as string;

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: incognito
          ? 'radial-gradient(ellipse at 20% 20%, #1e1b4b 0%, #0f0f1a 100%)'
          : 'radial-gradient(ellipse at 20% 20%, #064e3b 0%, #032b22 60%, #1a0800 100%)',
        transition: 'background 0.6s ease',
      }}
    >
      {/* Incognito ribbon */}
      {incognito && (
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-1.5" style={{ background: 'rgba(139,92,246,0.15)', borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
          <EyeOff size={11} className="text-violet-400" />
          <span className="text-[10px] text-violet-400 font-medium tracking-wider uppercase">Mode Incognito — aucune donnée enregistrée</span>
          <button onClick={() => setIncognito(false)} className="ml-2 text-[10px] text-violet-300 hover:text-white underline">Quitter</button>
        </div>
      )}

      {/* Left sidebar */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0"
        style={{
          borderRight: '1px solid var(--glass-border)',
          background: 'rgba(3,43,34,0.7)',
          backdropFilter: 'blur(20px)',
          paddingTop: incognito ? '32px' : 0,
        }}
      >
        <div className="p-5" style={{ borderBottom: '1px solid var(--glass-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
              <Bot size={16} color="#fbbf24" />
            </div>
            <div>
              <p className="font-semibold text-sm text-white leading-none">Dalil</p>
              <p className="text-[10px] text-emerald-400 mt-1 font-medium tracking-wide">SOVEREIGN ENGINE</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3 px-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{t(lang, 'domains')}</p>
          {[
            { label: t(lang, 'legal_admin') as string, icon: '⚖️' },
            { label: t(lang, 'business') as string, icon: '💼' },
            { label: t(lang, 'health') as string, icon: '🏥' },
            { label: t(lang, 'education') as string, icon: '📚' },
            { label: t(lang, 'digital') as string, icon: '🔐' },
            { label: t(lang, 'agriculture') as string, icon: '🌾' },
          ].map(d => (
            <button key={d.label} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all text-left mb-0.5"
              style={{ color: 'hsl(var(--muted-foreground))' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--glass-bg)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'hsl(var(--muted-foreground))'; }}
            >
              <span className="text-base leading-none">{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Lock size={11} className="text-emerald-400 shrink-0" />
            <p className="text-[10px] text-emerald-400 leading-snug font-medium">{t(lang, 'local_hosting')}<br />{t(lang, 'no_dependency')}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
            <Cpu size={11} color="#fbbf24" className="shrink-0" />
            <p className="text-[10px] gold-text leading-snug font-medium">{t(lang, 'indexed')}</p>
          </div>
          {/* Cameroon flag stripe */}
          <div className="flex gap-1.5 px-3 pt-1">
            {['#064e3b', '#dc2626', '#fbbf24'].map((c, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: c }} />
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0" style={{ paddingTop: incognito ? '32px' : 0 }}>
        {/* Header */}
        <header
          className="flex items-center justify-between px-5 py-3 sticky top-0 z-10"
          style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(3,43,34,0.6)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
              <Bot size={13} color="#fbbf24" />
            </div>
            <span className="font-semibold text-sm text-white">Dalil</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="pulse-dot" />
            <span className="text-xs text-emerald-400 font-medium" style={{ minWidth: 200 }}>
              {isTyping ? <span className="scanning-text">{scanningText}</span> : 'Sovereign retrieval active'}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Language toggle */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setShowLangMenu(p => !p)}
                className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border transition-all hover:border-[var(--gold-border)]"
                style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'hsl(var(--muted-foreground))' }}
              >
                <Languages size={12} />
                <span className="text-white font-medium">{LANGS.find(l => l.code === lang)?.flag} {LANGS.find(l => l.code === lang)?.label}</span>
              </button>
              {showLangMenu && (
                <div
                  className="absolute top-full right-0 mt-1.5 z-50 rounded-xl overflow-hidden"
                  style={{ background: 'rgba(3,43,34,0.97)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', minWidth: 120, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                >
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-all text-left"
                      style={{
                        background: lang === l.code ? 'var(--gold-dim)' : 'transparent',
                        color: lang === l.code ? 'var(--gold)' : 'hsl(var(--muted-foreground))',
                      }}
                    >
                      <span>{l.flag}</span>
                      <span className="font-medium">{l.label}</span>
                      {lang === l.code && <span className="ml-auto text-[9px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Incognito */}
            <button
              onClick={() => setIncognito(p => !p)}
              className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border transition-all"
              style={{
                background: incognito ? 'rgba(139,92,246,0.12)' : 'var(--glass-bg)',
                borderColor: incognito ? 'rgba(139,92,246,0.35)' : 'var(--glass-border)',
                color: incognito ? '#a78bfa' : 'hsl(var(--muted-foreground))',
              }}
            >
              <EyeOff size={12} />
              <span className="hidden sm:inline">{t(lang, 'incognito')}</span>
            </button>

            {/* News toggle */}
            <button
              onClick={() => setShowNews(p => !p)}
              className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border transition-all"
              style={{
                background: showNews ? 'rgba(220,38,38,0.1)' : 'var(--glass-bg)',
                borderColor: showNews ? 'rgba(220,38,38,0.3)' : 'var(--glass-border)',
                color: showNews ? '#f87171' : 'hsl(var(--muted-foreground))',
              }}
            >
              <Newspaper size={12} />
              <span className="hidden sm:inline">{t(lang, 'news_title')}</span>
              {showNews && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
            </button>

            <span className="sovereign-badge hidden sm:flex">
              <Shield size={9} />
              Sovereign
            </span>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chat area */}
          <main className="flex-1 overflow-y-auto relative">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center min-h-full px-6 py-16">
                {/* Watermark greeting */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <h1
                    style={{
                      fontSize: 'clamp(28px, 5vw, 48px)',
                      fontWeight: 100,
                      letterSpacing: '0.05em',
                      color: 'rgba(255,255,255,0.12)',
                      margin: 0,
                      lineHeight: 1.2,
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  >
                    {greeting}
                  </h1>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.18)', marginTop: 8, fontWeight: 300, letterSpacing: '0.02em' }}>
                    {greetingSub}
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto px-4 py-8">
                {messages.map(msg => <ChatMessage key={msg.id} message={msg} lang={lang} />)}
                {isTyping && (
                  <div className="flex gap-3 mb-8">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
                      <Bot size={14} color="#fbbf24" />
                    </div>
                    <div className="glass-card flex flex-col gap-2 px-5 py-4">
                      <span className="scanning-text">{scanningText}</span>
                      <div className="flex items-center gap-1.5">
                        {[0, 150, 300].map(d => (
                          <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                            style={{ background: 'var(--gold)', opacity: 0.6, animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </main>

          {/* News panel */}
          {showNews && (
            <aside
              className="hidden lg:flex flex-col w-72 shrink-0"
              style={{
                borderLeft: '1px solid var(--glass-border)',
                background: 'rgba(3,43,34,0.6)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <NewsPanel lang={lang} onClose={() => setShowNews(false)} />
            </aside>
          )}
        </div>

        {/* Bottom bar */}
        <div
          className="px-4 py-4 sticky bottom-0"
          style={{ borderTop: '1px solid var(--glass-border)', background: 'rgba(3,43,34,0.7)', backdropFilter: 'blur(20px)' }}
        >
          <div className="max-w-3xl mx-auto">
            <SearchBar onSend={handleSend} disabled={isTyping} lang={lang} incognito={incognito} />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-1">
                {['#064e3b', '#dc2626', '#fbbf24'].map((c, i) => (
                  <div key={i} style={{ width: 16, height: 2, borderRadius: 99, background: c, opacity: 0.6 }} />
                ))}
              </div>
              <p className="text-[10px] tracking-wide" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {t(lang, 'tagline')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
