import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { ArrowUp, Loader2, Search, ChevronDown, Zap, Brain, FlaskConical } from 'lucide-react';
import type { Language } from '../lib/i18n';
import { t } from '../lib/i18n';

type FocusMode = 'sovereign' | 'gazettes' | 'academic' | 'global' | 'legal';

const focusModes: { key: FocusMode; emoji: string; labelKey: string }[] = [
  { key: 'sovereign', emoji: '🛡', labelKey: 'sovereign_only' },
  { key: 'gazettes', emoji: '📜', labelKey: 'official_gazettes' },
  { key: 'academic', emoji: '🎓', labelKey: 'academic' },
  { key: 'global', emoji: '🌐', labelKey: 'global' },
  { key: 'legal', emoji: '⚖️', labelKey: 'legal' },
];

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
  "Comment créer une entreprise au Cameroun",
  "Loi sur la cybercriminalité Cameroun",
  "Obligations fiscales PME Cameroun",
  "Permis de construire Yaoundé",
];

interface SearchBarProps {
  onSend: (query: string) => void;
  disabled?: boolean;
  lang: Language;
  incognito?: boolean;
}

export interface SearchBarHandle {
  focus: () => void;
}

export const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(
  ({ onSend, disabled, lang, incognito }, ref) => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<FocusMode>('sovereign');
    const [showModeDropdown, setShowModeDropdown] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
    const [thinkMode, setThinkMode] = useState(false);
    const [deepSearch, setDeepSearch] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const currentMode = focusModes.find(m => m.key === mode)!;

    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
    }));

    useEffect(() => { if (!disabled) textareaRef.current?.focus(); }, [disabled]);

    useEffect(() => {
      const fn = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setShowModeDropdown(false);
        }
      };
      document.addEventListener('mousedown', fn);
      return () => document.removeEventListener('mousedown', fn);
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
        if (textareaRef.current) {
          textareaRef.current.style.height = '22px';
        }
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
        selectedSuggestion >= 0 && suggestions[selectedSuggestion] ? submit(suggestions[selectedSuggestion]) : submit();
      }
    };

    const modeLabelRaw = t(lang, currentMode.labelKey as any);
    const modeLabel = typeof modeLabelRaw === 'string' ? modeLabelRaw : currentMode.labelKey;

    return (
      <div className="searchbar-wrapper">
        {/* Autocomplete above */}
        {suggestions.length > 0 && (
          <div className="autocomplete-dropdown">
            {suggestions.map((s, i) => (
              <button
                key={s}
                onClick={() => submit(s)}
                onMouseEnter={() => setSelectedSuggestion(i)}
                className={`autocomplete-item ${selectedSuggestion === i ? 'active' : ''}`}
              >
                <Search size={11} style={{ opacity: 0.5, flexShrink: 0 }} />
                <span>{s}</span>
              </button>
            ))}
          </div>
        )}

        <div className={`searchbar-container ${showModeDropdown || suggestions.length > 0 ? 'focused' : ''}`}>
          {/* Toolbar */}
          <div className="searchbar-toolbar">
            {/* Focus mode */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowModeDropdown(p => !p)}
                className="mode-trigger"
              >
                <span>{currentMode.emoji}</span>
                <span className="hide-xs">{modeLabel}</span>
                <ChevronDown
                  size={10}
                  color="#fbbf24"
                  style={{ transform: showModeDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
                />
              </button>

              {showModeDropdown && (
                <div className="dropdown-menu" style={{ bottom: '100%', marginBottom: 6, minWidth: 190 }}>
                  {focusModes.map(fm => {
                    const labelRaw = t(lang, fm.labelKey as any);
                    const label = typeof labelRaw === 'string' ? labelRaw : fm.labelKey;
                    return (
                      <button
                        key={fm.key}
                        onClick={() => { setMode(fm.key); setShowModeDropdown(false); }}
                        className={`dropdown-item ${mode === fm.key ? 'active' : ''}`}
                      >
                        <span style={{ fontSize: 15 }}>{fm.emoji}</span>
                        <span>{label}</span>
                        {mode === fm.key && <span className="ml-auto text-[9px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="toolbar-divider" />

            {/* Think */}
            <button
              onClick={() => setThinkMode(p => !p)}
              className={`toolbar-btn ${thinkMode ? 'active-violet' : ''}`}
            >
              <Brain size={11} />
              <span className="hide-xs">{t(lang, 'think') as string}</span>
            </button>

            {/* DeepSearch */}
            <button
              onClick={() => setDeepSearch(p => !p)}
              className={`toolbar-btn ${deepSearch ? 'active-green' : ''}`}
            >
              <Zap size={11} />
              <span className="hide-xs">{t(lang, 'deep_search') as string}</span>
            </button>

            {/* Research PRO */}
            <button className="toolbar-btn active-red ml-auto">
              <FlaskConical size={11} />
              <span className="hide-xs">{t(lang, 'research') as string}</span>
              <span className="pro-badge">PRO</span>
            </button>
          </div>

          {/* Input row */}
          <div className="searchbar-input-row">
            <Search size={14} style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0, marginBottom: 2 }} />
            <textarea
              ref={textareaRef}
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
              className="searchbar-textarea"
              style={{ height: '22px', minHeight: '22px', maxHeight: '120px' }}
            />
            <button
              onClick={() => submit()}
              disabled={!query.trim() || disabled}
              className="send-btn"
              style={{
                background: query.trim() && !disabled ? 'var(--gold)' : 'var(--glass-bg)',
                color: query.trim() && !disabled ? '#032b22' : 'hsl(var(--muted-foreground))',
              }}
            >
              {disabled
                ? <Loader2 size={13} style={{ color: 'hsl(var(--muted-foreground))' }} className="animate-spin" />
                : <ArrowUp size={13} />}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
