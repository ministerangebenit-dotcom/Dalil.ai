import { useState, useRef, useEffect, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { ChatMessage } from './components/chat/ChatMessage';
import { SplashScreen } from './components/SplashScreen';
import { NewsPanel } from './components/NewsPanel';
import { queryDalil, checkBackendHealth } from './lib/api';
import { Bot, Lock, Newspaper, EyeOff, Languages, Plus, Shield, Cpu } from 'lucide-react';
import type { Language } from './lib/i18n';
import { t, getGreeting } from './lib/i18n';
import './index.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: any;
  streaming?: boolean;
  streamedSummary?: string;
  relatedQuestions?: string[];
}

const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'pid', label: 'PID', flag: '🇨🇲' },
];

const RELATED_QUESTIONS: Record<string, string[]> = {
  default: [
    'What documents do I need to bring?',
    'How much does this cost in total?',
    'Are there any recent changes to this law?',
  ],
};

function getRelatedQuestions(query: string, lang: Language): string[] {
  const q = query.toLowerCase();
  if (q.includes('company') || q.includes('entreprise') || q.includes('business') || q.includes('sarl')) {
    return lang === 'fr'
      ? ['Quel est le capital minimum pour une SARL ?', 'Comment obtenir un NIU fiscal ?', 'Quels impôts pour une nouvelle entreprise ?']
      : lang === 'pid'
      ? ['How much money I need to start ?', 'Which office I go first ?', 'How long e go take ?']
      : ['What is the minimum capital for an SARL?', 'How do I get a tax ID number?', 'What taxes apply to new businesses?'];
  }
  if (q.includes('permit') || q.includes('permis') || q.includes('building') || q.includes('construire')) {
    return lang === 'fr'
      ? ['Combien de temps pour un permis de construire ?', 'Quels plans sont requis ?', 'Peut-on construire sans permis ?']
      : ['How long does a building permit take?', 'What plans are required?', 'What happens if I build without a permit?'];
  }
  if (q.includes('tax') || q.includes('impôt') || q.includes('fiscal') || q.includes('tva')) {
    return lang === 'fr'
      ? ['Quelles sont les échéances fiscales au Cameroun ?', 'Comment déclarer la TVA ?', 'Existe-t-il des exonérations pour PME ?']
      : ['What are the tax deadlines in Cameroon?', 'How do I declare VAT?', 'Are there SME tax exemptions?'];
  }
  if (q.includes('passport') || q.includes('passeport') || q.includes('cni') || q.includes('identity')) {
    return lang === 'fr'
      ? ['Combien coûte un passeport camerounais ?', 'Où faire ma CNI à Yaoundé ?', 'Délai de délivrance du passeport ?']
      : ['How much does a Cameroonian passport cost?', 'Where to get a national ID in Yaoundé?', 'How long does passport delivery take?'];
  }
  if (q.includes('cnps') || q.includes('social') || q.includes('retraite') || q.includes('pension')) {
    return lang === 'fr'
      ? ['Comment calculer les cotisations CNPS ?', 'Puis-je cotiser en tant qu\'indépendant ?', 'Comment obtenir une pension de retraite ?']
      : ['How are CNPS contributions calculated?', 'Can I contribute as self-employed?', 'How to get a retirement pension in Cameroon?'];
  }
  return lang === 'fr'
    ? ['Quels documents sont nécessaires ?', 'Quel est le coût total ?', 'Y a-t-il des changements récents à cette loi ?']
    : lang === 'pid'
    ? ['Wetin documents dem need ?', 'How much e go cost ?', 'Any new law for dis mata ?']
    : RELATED_QUESTIONS.default;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [scanningText, setScanningText] = useState('');
  const [lang, setLang] = useState<Language>('fr');
  const [showNews, setShowNews] = useState(false);
  const [incognito, setIncognito] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<{ focus: () => void }>(null);

  const scanningMessages: string[] = t(lang, 'scanning') as string[];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Scanning text rotation while typing
  useEffect(() => {
    if (!isTyping) { setScanningText(''); return; }
    let i = 0;
    setScanningText(scanningMessages[0]);
    const iv = setInterval(() => {
      i = (i + 1) % scanningMessages.length;
      setScanningText(scanningMessages[i]);
    }, 500);
    return () => clearInterval(iv);
  }, [isTyping, lang]);

  // Close lang menu on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Ctrl+K global shortcut
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchBarRef.current?.focus();
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then(online => setBackendOnline(online));
  }, []);

  // Stream summary char by char
  const streamSummary = useCallback((
    fullText: string,
    messageId: string,
    onDone: () => void
  ) => {
    let i = 0;
    const step = 3;
    const iv = setInterval(() => {
      i = Math.min(i + step, fullText.length);
      setMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, streamedSummary: fullText.slice(0, i) } : m
      ));
      if (i >= fullText.length) {
        clearInterval(iv);
        onDone();
      }
    }, 18);
    return iv;
  }, []);

  const handleSend = useCallback(async (query: string) => {
    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    setMessages(prev => [...prev, {
      id: userMsgId,
      role: 'user',
      content: query,
    }]);
    setIsTyping(true);

    try {
      const response = await queryDalil(query, lang);
      const related = getRelatedQuestions(query, lang);

      setMessages(prev => [...prev, {
        id: assistantMsgId,
        role: 'assistant',
        content: response,
        streaming: true,
        streamedSummary: '',
        relatedQuestions: related,
      }]);
      setIsTyping(false);

      streamSummary(response.summary, assistantMsgId, () => {
        setMessages(prev => prev.map(m =>
          m.id === assistantMsgId ? { ...m, streaming: false } : m
        ));
      });

    } catch (error) {
      setIsTyping(false);
      console.error('[Dalil] handleSend error:', error);
    }
  }, [lang, streamSummary]);

  const isEmpty = messages.length === 0;
  const greeting = getGreeting(lang);
  const greetingSub = t(lang, 'greeting_sub') as string;

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  return (
    <div
      className="dalil-root"
      style={{
        background: incognito
          ? 'radial-gradient(ellipse at 20% 20%, #1e1b4b 0%, #0f0f1a 100%)'
          : 'radial-gradient(ellipse at 20% 20%, #064e3b 0%, #032b22 60%, #1a0800 100%)',
        transition: 'background 0.6s ease',
      }}
    >
      {/* Incognito ribbon */}
      {incognito && (
        <div className="incognito-ribbon">
          <EyeOff size={11} style={{ color: '#a78bfa' }} />
          <span>Mode Incognito — aucune donnée enregistrée</span>
          <button onClick={() => setIncognito(false)}>Quitter</button>
        </div>
      )}

      {/* Sidebar — desktop only */}
      <aside className="dalil-sidebar" style={{ paddingTop: incognito ? 32 : 0 }}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Bot size={16} color="#fbbf24" />
          </div>
          <div>
            <p className="logo-name">Dalil</p>
            <p className="logo-sub">SOVEREIGN ENGINE</p>
          </div>
        </div>

        <div className="sidebar-body">
          <p className="sidebar-section-label">{t(lang, 'domains') as string}</p>
          {[
            { label: t(lang, 'legal_admin') as string, icon: '⚖️' },
            { label: t(lang, 'business') as string, icon: '💼' },
            { label: t(lang, 'health') as string, icon: '🏥' },
            { label: t(lang, 'education') as string, icon: '📚' },
            { label: t(lang, 'digital') as string, icon: '🔐' },
            { label: t(lang, 'agriculture') as string, icon: '🌾' },
          ].map(d => (
            <button key={d.label} className="sidebar-domain-btn">
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-badge green">
            <Lock size={11} style={{ color: '#34d399', flexShrink: 0 }} />
            <span>{t(lang, 'local_hosting') as string}<br />{t(lang, 'no_dependency') as string}</span>
          </div>
          <div className="sidebar-badge gold">
            <Cpu size={11} color="#fbbf24" style={{ flexShrink: 0 }} />
            <span>{t(lang, 'indexed') as string}</span>
          </div>
          <div className="flag-stripe">
            {['#064e3b', '#dc2626', '#fbbf24'].map((c, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: c }} />
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="dalil-main" style={{ paddingTop: incognito ? 32 : 0 }}>

        {/* Header */}
        <header className="dalil-header">
          {/* Mobile logo */}
          <div className="mobile-logo">
            <div className="logo-icon-sm">
              <Bot size={13} color="#fbbf24" />
            </div>
            <span>Dalil</span>
          </div>

          {/* Desktop status */}
          <div className="desktop-status">
            <div className={`pulse-dot ${backendOnline === false ? 'offline' : ''}`} />
            <span className="status-text">
              {isTyping
                ? <span className="scanning-text">{scanningText}</span>
                : backendOnline === false
                ? 'Demo mode — backend offline'
                : backendOnline === true
                ? 'Sovereign retrieval active'
                : 'Connecting...'}
            </span>
          </div>

          {/* Header actions */}
          <div className="header-actions">
            {/* New chat */}
            <button
              onClick={() => setMessages([])}
              className="header-btn icon-only"
              title="New chat"
            >
              <Plus size={14} />
            </button>

            {/* Language toggle */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setShowLangMenu(p => !p)}
                className="header-btn"
              >
                <Languages size={12} />
                <span>{LANGS.find(l => l.code === lang)?.flag} {LANGS.find(l => l.code === lang)?.label}</span>
              </button>
              {showLangMenu && (
                <div className="dropdown-menu" style={{ right: 0, minWidth: 120 }}>
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                      className={`dropdown-item ${lang === l.code ? 'active' : ''}`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                      {lang === l.code && <span style={{ marginLeft: 'auto' }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Incognito */}
            <button
              onClick={() => setIncognito(p => !p)}
              className={`header-btn ${incognito ? 'active-violet' : ''}`}
            >
              <EyeOff size={12} />
              <span className="hide-xs">{t(lang, 'incognito') as string}</span>
            </button>

            {/* News */}
            <button
              onClick={() => setShowNews(p => !p)}
              className={`header-btn ${showNews ? 'active-red' : ''}`}
            >
              <Newspaper size={12} />
              <span className="hide-xs">{t(lang, 'news_title') as string}</span>
              {showNews && <span className="live-dot" />}
            </button>

            <span className="sovereign-badge hide-sm">
              <Shield size={9} />
              Sovereign
            </span>
          </div>
        </header>

        {/* Body */}
        <div className="dalil-body">

          {/* Chat area */}
          <main className="dalil-chat">
            {isEmpty ? (
              <div className="empty-state">
                <h1 className="watermark-greeting">{greeting}</h1>
                <p className="watermark-sub">{greetingSub}</p>
                <p className="shortcut-hint">
                  <kbd>Ctrl</kbd> + <kbd>K</kbd> to focus search
                </p>
              </div>
            ) : (
              <div className="messages-container">
                {messages.map(msg => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    lang={lang}
                    onFollowUp={handleSend}
                  />
                ))}
                {isTyping && (
                  <div className="typing-indicator">
                    <div className="typing-avatar">
                      <Bot size={14} color="#fbbf24" />
                    </div>
                    <div className="typing-bubble glass-card">
                      <span className="scanning-text">{scanningText}</span>
                      <div className="typing-dots">
                        {[0, 150, 300].map(d => (
                          <span
                            key={d}
                            className="typing-dot"
                            style={{ animationDelay: `${d}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </main>

          {/* News panel — desktop only */}
          {showNews && (
            <aside className="news-panel">
              <NewsPanel lang={lang} onClose={() => setShowNews(false)} />
            </aside>
          )}
        </div>

        {/* Bottom search bar */}
        <div className="dalil-bottom">
          <div className="bottom-inner">
            <SearchBar
              ref={searchBarRef}
              onSend={handleSend}
              disabled={isTyping}
              lang={lang}
              incognito={incognito}
            />
            <div className="bottom-meta">
              <div className="flag-stripe-sm">
                {['#064e3b', '#dc2626', '#fbbf24'].map((c, i) => (
                  <div
                    key={i}
                    style={{ width: 14, height: 2, borderRadius: 99, background: c, opacity: 0.5 }}
                  />
                ))}
              </div>
              <p className="tagline">{t(lang, 'tagline') as string}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
