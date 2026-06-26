import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';

interface Source {
  title: string;
  url: string;
  snippet: string;
}

export function CitationTooltip({ index, source }: { index: number; source: Source }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full text-xs font-mono">
          {index}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs p-3">
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium underline text-sm block mb-1"
        >
          {source.title}
        </a>
        <p className="text-xs text-muted-foreground">{source.snippet}</p>
      </TooltipContent>
    </Tooltip>
  );
}
