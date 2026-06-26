import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { ShieldCheck } from 'lucide-react';

interface Source {
  title: string;
  url: string;
  snippet: string;
}

function isSovereign(url: string): boolean {
  return url.includes('.cm') || url.includes('gouvernement') || url.includes('ministered') || url.includes('prc.cm');
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function CitationTooltip({ index, source }: { index: number; source: Source }) {
  const domain = extractDomain(source.url);
  const sovereign = isSovereign(source.url);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 rounded-full text-xs font-medium flex items-center gap-1 bg-white/80 backdrop-blur-sm border-gray-200 hover:border-primary"
        >
          <span className="text-muted-foreground">{domain}</span>
          {sovereign && <ShieldCheck className="h-3 w-3 text-yellow-500" />}
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
        {sovereign && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-yellow-600">
            <ShieldCheck className="h-3 w-3" />
            Sovereign Verified
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
