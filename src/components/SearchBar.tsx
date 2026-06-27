import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2, Search } from 'lucide-react';

type FocusMode = 'sovereign' | 'gazettes' | 'academic' | 'global';

const modes: { key: FocusMode; label: string }[] = [
  { key: 'sovereign', label: '🛡 Sovereign (.cm)' },
  { key: 'gazettes', label: '📜 Official Gazettes' },
  { key: 'academic', label: '🎓 Academic' },
  { key: 'global', label: '🌐 Global Knowledge' },
];

interface SearchBarProps {
  onSend: (query: string) => void;
  disabled?: boolean;
}

export function SearchBar({ onSend, disabled }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<FocusMode>('sovereign');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (!disabled) ref.current?.focus(); }, [disabled]);

  const submit = () => {
    if (query.trim() && !disabled) { onSend(query.trim()); setQuery(''); }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[var(--glass-border)] overflow-x-auto">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`toggle-option ${mode === m.key ? 'active' : ''}`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="relative flex items-end gap-2 glass rounded-2xl px-4 py-3 focus-within:border-[var(--gold-border)] transition-all">
        <Search size={15} className="text-[hsl(var(--muted-foreground))] shrink-0 mb-0.5" />
        <textarea
          ref={ref}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder={`Ask about a Cameroonian procedure, law, or regulation...`}
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none leading-relaxed"
          style={{ height: '22px', minHeight: '22px', maxHeight: '120px' }}
        />
        <button
          onClick={submit}
          disabled={!query.trim() || disabled}
          className="w-8 h-8 rounded-xl bg-[var(--gold)] disabled:bg-[var(--glass-bg)] flex items-center justify-center text-[#064e3b] disabled:text-[hsl(var(--muted-foreground))] shrink-0 hover:opacity-90 active:scale-95 transition-all mb-0.5 font-bold"
        >
          {disabled ? <Loader2 size={13} className="animate-spin text-[hsl(var(--muted-foreground))]" /> : <ArrowUp size={13} />}
        </button>
      </div>
    </div>
  );
}
