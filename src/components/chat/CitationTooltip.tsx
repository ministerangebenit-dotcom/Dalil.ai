import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface Source { title: string; url: string; snippet: string; }

function isSovereign(url: string): boolean {
  return url.includes('.cm') || url.includes('gouvernement') || url.includes('minfi.gov') || url.includes('cnps.cm') || url.includes('ministered');
}

function extractDomain(url: string): string {
  try {
    const h = new URL(url).hostname.replace('www.', '');
    // Shorten long domains
    return h.length > 22 ? h.slice(0, 20) + '…' : h;
  } catch {
    return url.length > 18 ? url.slice(0, 16) + '…' : url;
  }
}

export function CitationTooltip({ index, source }: { index: number; source: Source }) {
  const domain = extractDomain(source.url);
  const sovereign = isSovereign(source.url);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-[11px] font-medium text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-foreground transition-all shadow-sm">
          <span className="truncate max-w-[90px]">{domain}</span>
          {sovereign && (
            <span className="sovereign-shield flex items-center gap-0.5">
              <ShieldCheck size={9} />
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs p-3 rounded-xl">
        <a href={source.url} target="_blank" rel="noopener noreferrer"
          className="flex items-start gap-1.5 text-blue-600 dark:text-blue-400 font-medium text-xs mb-1 hover:underline">
          <ExternalLink size={10} className="mt-0.5 shrink-0" />
          {source.title}
        </a>
        <p className="text-xs text-muted-foreground leading-relaxed">{source.snippet}</p>
        {sovereign && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800/50 px-2 py-1 rounded-md">
            <ShieldCheck size={11} />
            Sovereign Verified — Official Cameroonian source
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
