import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowUp, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSend: (query: string) => void;
  disabled?: boolean;
}

export function SearchBar({ onSend, disabled }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSend(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about a procedure... e.g., Register a sole proprietorship in Douala"
        className="pr-12 py-6 text-base shadow-sm border-gray-200 rounded-xl"
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-2 text-muted-foreground hover:text-primary"
        disabled={!query.trim() || disabled}
      >
        {disabled ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ArrowUp className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}
