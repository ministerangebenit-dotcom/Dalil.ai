import { useState } from 'react';
import { X, ExternalLink, TrendingUp, Radio } from 'lucide-react';
import type { Language } from '../lib/i18n';
import { t } from '../lib/i18n';

const mockNews = [
  { id: 1, category: 'Tech', title: 'Minpostel lance la Semaine de l\'Innovation Numérique 2026', source: 'minpostel.gov.cm', time: '2h', url: '#', hot: true },
  { id: 2, category: 'Economy', title: 'La Banque Centrale annonce de nouvelles directives fintech pour le Cameroun', source: 'beac.int', time: '4h', url: '#', hot: false },
  { id: 3, category: 'Legal', title: 'Publication du nouveau Code du Numérique au Journal Officiel', source: 'spm.gov.cm', time: '6h', url: '#', hot: true },
  { id: 4, category: 'Education', title: 'L\'Université de Yaoundé I lance son programme d\'IA souveraine', source: 'uy1.uninet.cm', time: '8h', url: '#', hot: false },
  { id: 5, category: 'Cyber', title: 'Cameroun : hausse de 40% des cyberattaques sur les PME en 2026', source: 'antic.cm', time: '12h', url: '#', hot: true },
  { id: 6, category: 'Business', title: 'MTN Cameroun déploie l\'authentification biométrique MoMo', source: 'mtn.cm', time: '1j', url: '#', hot: false },
];

const categoryColors: Record<string, string> = {
  Tech: 'bg-[rgba(251,191,36,0.12)] text-[#fbbf24] border-[rgba(251,191,36,0.25)]',
  Economy: 'bg-[rgba(16,185,129,0.1)] text-emerald-400 border-[rgba(16,185,129,0.25)]',
  Legal: 'bg-[rgba(220,38,38,0.1)] text-red-400 border-[rgba(220,38,38,0.25)]',
  Education: 'bg-[rgba(139,92,246,0.1)] text-violet-400 border-[rgba(139,92,246,0.25)]',
  Cyber: 'bg-[rgba(220,38,38,0.1)] text-red-400 border-[rgba(220,38,38,0.25)]',
  Business: 'bg-[rgba(16,185,129,0.1)] text-emerald-400 border-[rgba(16,185,129,0.25)]',
};

interface NewsPanelProps {
  lang: Language;
  onClose: () => void;
}

export function NewsPanel({ lang, onClose }: NewsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = [...new Set(mockNews.map(n => n.category))];
  const filtered = activeCategory ? mockNews.filter(n => n.category === activeCategory) : mockNews;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <Radio size={13} className="text-red-400" />
          <span className="text-xs font-semibold text-white tracking-wide">{t(lang, 'news_title')}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded-md flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-white hover:bg-[var(--glass-bg)] transition-all">
          <X size={13} />
        </button>
      </div>

      <div className="flex gap-1.5 px-3 py-2.5 border-b border-[var(--glass-border)] overflow-x-auto">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-[10px] px-2.5 py-1 rounded-full border font-medium whitespace-nowrap transition-all ${!activeCategory ? 'bg-[var(--gold-dim)] border-[var(--gold-border)] gold-text' : 'bg-transparent border-[var(--glass-border)] text-[hsl(var(--muted-foreground))] hover:text-white'}`}
        >All</button>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c === activeCategory ? null : c)}
            className={`text-[10px] px-2.5 py-1 rounded-full border font-medium whitespace-nowrap transition-all ${activeCategory === c ? 'bg-[var(--gold-dim)] border-[var(--gold-border)] gold-text' : 'bg-transparent border-[var(--glass-border)] text-[hsl(var(--muted-foreground))] hover:text-white'}`}
          >{c}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.map(item => (
          <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
            className="block p-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:border-[var(--gold-border)] transition-all no-underline group">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${categoryColors[item.category]}`}>
                {item.category}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {item.hot && <TrendingUp size={10} className="text-red-400" />}
                <span className="text-[9px] text-[hsl(var(--muted-foreground))]">{item.time}</span>
              </div>
            </div>
            <p className="text-xs text-white leading-snug mb-2 group-hover:gold-text transition-colors">{item.title}</p>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-[hsl(var(--muted-foreground))] font-mono">{item.source}</span>
              <ExternalLink size={9} className="text-[hsl(var(--muted-foreground))] group-hover:gold-text transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
