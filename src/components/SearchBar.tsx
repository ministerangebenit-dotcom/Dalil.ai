import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2, Search } from 'lucide-react';

interface SearchBarProps {
  onSend: (query: string) => void;
  disabled?: boolean;
}

export function SearchBar({ onSend, disabled }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  const submit = () => {
    if (query.trim() && !disabled) { onSend(query.trim()); setQuery(''); }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  return (
    <div className="relative flex items-end gap-2 bg-[var(--dalil-surface)] border border-border rounded-2xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900 transition-all shadow-sm">
      <Search size={16} className="text-muted-foreground shrink-0 mb-0.5" />
      <textarea
        ref={ref}
        value={query}
        onChange={e => { setQuery(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
        onKeyDown={onKey}
        placeholder="Ask about a Cameroonian procedure, law, or regulation..."
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none leading-relaxed min-h-[22px] max-h-[120px] overflow-y-auto"
        style={{ height: '22px' }}
      />
      <button
        onClick={submit}
        disabled={!query.trim() || disabled}
        className="w-8 h-8 rounded-xl bg-blue-600 disabled:bg-muted flex items-center justify-center text-white shrink-0 hover:bg-blue-700 active:scale-95 transition-all shadow-sm disabled:shadow-none mb-0.5"
      >
        {disabled ? <Loader2 size={14} className="animate-spin" /> : <ArrowUp size={14} />}
      </button>
    </div>
  );
}
