import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ExternalLink } from 'lucide-react';

interface Source { title: string; url: string; snippet: string; }

export function CitationTooltip({ index, source }: { index: number; source: Source }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-[10px] font-mono font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors">
          {index}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs p-3 rounded-xl">
        <a href={source.url} target="_blank" rel="noopener noreferrer"
          className="flex items-start gap-1.5 text-blue-600 dark:text-blue-400 font-medium text-xs mb-1 hover:underline">
          <ExternalLink size={10} className="mt-0.5 shrink-0" />
          {source.title}
        </a>
        <p className="text-xs text-muted-foreground leading-relaxed">{source.snippet}</p>
      </TooltipContent>
    </Tooltip>
  );
}
