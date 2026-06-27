import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp, Loader2, Search, ChevronDown, Zap, Brain, FlaskConical, Lock } from 'lucide-react';
import type { Language } from '../lib/i18n';
import { t } from '../lib/i18n';

type FocusMode = 'sovereign' | 'gazettes' | 'academic' | 'global' | 'legal';

const focusModes: { key: FocusMode; emoji: string; labelKey: keyof ReturnType<typeof getFocusLabels> }[] = [
  { key: 'sovereign', emoji: '🛡', labelKey: 'sovereign_only' },
  { key: 'gazettes', emoji: '📜', labelKey: 'official_gazettes' },
  { key: 'academic', emoji: '🎓', labelKey: 'academic' },
  { key: 'global', emoji: '🌐', labelKey: 'global' },
  { key: 'legal', emoji: '⚖️', labelKey: 'legal' },
];

function getFocusLabels(lang: Language) {
  return {
    sovereign_only: t(lang, 'sovereign_only') as string,
    official_gazettes: t(lang, 'official_gazettes') as string,
    academic: t(lang, 'academic') as string,
    global: t(lang, 'global') as string,
    legal: t(lang, 'legal') as string,
  };
}

const autocompleteBank = [
  "How to register a company in Cameroon",
  "How to get a passport in Cameroon",
  "Cybercrime law in Cameroon",
  "Mobile money regulations Cameroon",
  "Tax obligations for SMEs in Cameroon",
  "How to obtain a building permit in Yaoundé",
  "CNPS registration process Cameroon",
  "Import export regulations Cameroon",
  "Labour law Cameroon",
  "How to open a bank account in Cameroon",
  "Digital ID Cameroon",
  "Anti-corruption laws Cameroon",
  "Business license Cameroon",
  "Land title registration Cameroon",
  "RCCM registration Cameroon",
];

interface SearchBarProps {
  onSend: (query: string) => void;
  disabled?: boolean;
  lang: Language;
  incognito?: boolean;
}

export function SearchBar({ onSend, disabled, lang, incognito }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<FocusMode>('sovereign');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [thinkMode, setThinkMode] = useState(false);
  const [deepSearch, setDeepSearch] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const labels = getFocusLabels(lang);
  const currentMode = focusModes.find(m => m.key === mode)!;

  useEffect(() => { if (!disabled) ref.current?.focus(); }, [disabled]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowModeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const updateSuggestions = useCallback((val: string) => {
    if (val.trim().length < 2) { setSuggestions([]); return; }
    const lower = val.toLowerCase();
    const matches = autocompleteBank.filter(s => s.toLowerCase().includes(lower)).slice(0, 5);
    setSuggestions(matches);
    setSelectedSuggestion(-1);
  }, []);

  const submit = (value?: string) => {
    const q = (value ?? query).trim();
    if (q && !disabled) {
      onSend(q);
      setQuery('');
      setSuggestions([]);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedSuggestion(p => Math.min(p + 1, suggestions.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedSuggestion(p => Math.max(p - 1, -1)); return; }
      if (e.key === 'Tab' && selectedSuggestion >= 0) { e.preventDefault(); setQuery(suggestions[selectedSuggestion]); setSuggestions([]); return; }
      if (e.key === 'Escape') { setSuggestions([]); return; }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        submit(suggestions[selectedSuggestion]);
      } else {
        submit();
      }
    }
  };

  const activeModeBadge = incognito
    ? <><Lock size={11} className="text-violet-400" /><span className="text-violet-400">Incognito</span></>
    : <><span>{currentMode.emoji}</span><span className="text-white">{labels[currentMode.labelKey]}</span></>;

  return (
    <div className="space-y-2 relative">
      <div className="relative glass rounded-2xl transition-all focus-within:border-[var(--gold-border)]" style={{ border: '1px solid var(--glass-border)' }}>
        {/* Top toolbar */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-[var(--glass-border)]">
          {/* Focus mode dropdown trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowModeDropdown(p => !p)}
              className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border transition-all hover:border-[var(--gold-border)]"
              style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-border)' }}
            >
              {activeModeBadge}
              <ChevronDown size={10} className="gold-text ml-0.5" style={{ transform: showModeDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {showModeDropdown && (
              <div
                className="absolute bottom-full left-0 mb-2 z-50 rounded-xl overflow-hidden"
                style={{ background: 'rgba(3,43,34,0.97)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', minWidth: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
              >
                <div className="p-1.5 space-y-0.5">
                  {focusModes.map(fm => (
                    <button
                      key={fm.key}
                      onClick={() => { setMode(fm.key); setShowModeDropdown(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all text-left"
                      style={{
                        background: mode === fm.key ? 'var(--gold-dim)' : 'transparent',
                        color: mode === fm.key ? 'var(--gold)' : 'hsl(var(--muted-foreground))',
                      }}
                    >
                      <span className="text-base leading-none">{fm.emoji}</span>
                      <span className="font-medium">{labels[fm.labelKey]}</span>
                      {mode === fm.key && <span className="ml-auto text-[9px] gold-text">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-4" style={{ background: 'var(--glass-border)' }} />

          {/* Think mode */}
          <button
            onClick={() => setThinkMode(p => !p)}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition-all"
            style={{
              background: thinkMode ? 'rgba(139,92,246,0.12)' : 'transparent',
              borderColor: thinkMode ? 'rgba(139,92,246,0.35)' : 'var(--glass-border)',
              color: thinkMode ? '#a78bfa' : 'hsl(var(--muted-foreground))',
            }}
          >
            <Brain size={11} />
            <span>{t(lang, 'think')}</span>
          </button>

          {/* DeepSearch */}
          <button
            onClick={() => setDeepSearch(p => !p)}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition-all"
            style={{
              background: deepSearch ? 'rgba(16,185,129,0.1)' : 'transparent',
              borderColor: deepSearch ? 'rgba(16,185,129,0.3)' : 'var(--glass-border)',
              color: deepSearch ? '#34d399' : 'hsl(var(--muted-foreground))',
            }}
          >
            <Zap size={11} />
            <span>{t(lang, 'deep_search')}</span>
          </button>

          {/* Research PRO */}
          <button className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition-all ml-auto"
            style={{ borderColor: 'rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.07)', color: '#f87171' }}>
            <FlaskConical size={11} />
            <span>{t(lang, 'research')}</span>
            <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: 'rgba(220,38,38,0.2)', color: '#f87171', letterSpacing: '0.05em' }}>PRO</span>
          </button>
        </div>

        {/* Input area */}
        <div className="flex items-end gap-2 px-4 py-3">
          <Search size={14} className="text-[hsl(var(--muted-foreground))] shrink-0 mb-0.5" />
          <textarea
            ref={ref}
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              updateSuggestions(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={onKey}
            placeholder={t(lang, 'placeholder') as string}
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none leading-relaxed"
            style={{ height: '22px', minHeight: '22px', maxHeight: '120px' }}
          />
          <button
            onClick={() => submit()}
            disabled={!query.trim() || disabled}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 hover:opacity-90 active:scale-95 transition-all mb-0.5 font-bold"
            style={{
              background: query.trim() ? 'var(--gold)' : 'var(--glass-bg)',
              color: query.trim() ? '#032b22' : 'hsl(var(--muted-foreground))',
            }}
          >
            {disabled ? <Loader2 size={13} className="animate-spin" style={{ color: 'hsl(var(--muted-foreground))' }} /> : <ArrowUp size={13} />}
          </button>
        </div>
      </div>

      {/* Autocomplete dropdown */}
      {suggestions.length > 0 && (
        <div
          className="absolute left-0 right-0 z-40 rounded-xl overflow-hidden"
          style={{ bottom: '100%', marginBottom: 6, background: 'rgba(3,43,34,0.97)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
          {suggestions.map((s, i) => (
            <button
              key={s}
              onClick={() => submit(s)}
              onMouseEnter={() => setSelectedSuggestion(i)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-all"
              style={{ background: selectedSuggestion === i ? 'var(--gold-dim)' : 'transparent', color: selectedSuggestion === i ? 'var(--gold)' : 'hsl(var(--muted-foreground))' }}
            >
              <Search size={12} style={{ opacity: 0.5 }} />
              <span>{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
