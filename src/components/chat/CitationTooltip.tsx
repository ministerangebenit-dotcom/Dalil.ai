import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ExternalLink, Shield } from 'lucide-react';

interface Source { title: string; url: string; snippet: string; domain: string; isOfficial: boolean; }

export function CitationChip({ index, source, small }: { index: number; source: Source; small?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-full border transition-all no-underline hover:opacity-90
            ${source.isOfficial
              ? 'bg-[var(--gold-dim)] border-[var(--gold-border)] gold-text'
              : 'bg-[var(--glass-bg)] border-[var(--glass-border)] text-[hsl(var(--muted-foreground))]'
            }
            ${small ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2.5 py-1'}
          `}
        >
          {source.isOfficial && <Shield size={small ? 8 : 9} />}
          <span className="font-medium">[{source.domain}]</span>
        </a>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs p-3 rounded-xl bg-[#032b22] border border-[var(--glass-border)] text-white">
        <a href={source.url} target="_blank" rel="noopener noreferrer"
          className="flex items-start gap-1.5 gold-text font-medium text-xs mb-1.5 hover:underline no-underline">
          <ExternalLink size={10} className="mt-0.5 shrink-0" />
          {source.title}
        </a>
        <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed">{source.snippet}</p>
        {source.isOfficial && (
          <div className="flex items-center gap-1 mt-2">
            <Shield size={9} className="gold-text" />
            <span className="text-[9px] gold-text font-semibold uppercase tracking-wider">Official Cameroonian Source</span>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
