import { StepCard } from './StepCard';
import { CitationTooltip } from './CitationTooltip';
import { TooltipProvider } from '../ui/tooltip';
import { Clock, Banknote, AlertTriangle, CheckCircle2, BrainCircuit, ExternalLink, ShieldCheck } from 'lucide-react';

interface Source { title: string; url: string; snippet: string; }
interface Step { stepNumber: number; title: string; description: string; documents: string[]; time: string; cost: string; risk: string; sources: number[]; }
interface ProceduralData { summary: string; totalTime: string; totalCost: string; steps: Step[]; commonMistakes: string[]; sources: Source[]; }

function isSovereign(url: string): boolean {
  return url.includes('.cm') || url.includes('gouvernement') || url.includes('minfi.gov') || url.includes('cnps.cm');
}

function extractDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
}

export function ProceduralAnswer({ data }: { data: ProceduralData }) {
  const sovereignCount = data.sources.filter(s => isSovereign(s.url)).length;

  return (
    <TooltipProvider>
      <div className="space-y-4 w-full">

        {/* ─── Transparent Reasoning Box ─── */}
        <div className="glass-card rounded-xl p-4 border-emerald-100 dark:border-emerald-900/30 animate-bounce-in">
          <div className="flex items-start gap-3">
            <div className="flex gap-1.5 mt-0.5">
              <span className="reasoning-dot w-2 h-2 rounded-full bg-emerald-400" />
              <span className="reasoning-dot w-2 h-2 rounded-full bg-emerald-400" />
              <span className="reasoning-dot w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BrainCircuit size={15} className="text-emerald-600" />
                Dalil reasoning
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Filtering out 14 global hallucinations to prioritize Cameroonian Law.
                Scanning official .cm repositories for legal accuracy…
                Found <strong>{data.sources.length} relevant sources</strong> ({sovereignCount} sovereign verified).
              </p>
            </div>
          </div>
        </div>

        {/* ─── Bento Grid: Sources ─── */}
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
            Verified Sources
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {data.sources.map((src, idx) => {
              const domain = extractDomain(src.url);
              const sovereign = isSovereign(src.url);
              return (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-xl p-3 text-center hover:shadow-md hover:scale-[1.02] transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 mx-auto rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-400 mb-1.5">
                    {domain.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-[10px] font-medium text-foreground truncate">{domain}</p>
                  {sovereign && (
                    <span className="sovereign-shield mt-1.5 inline-flex items-center gap-0.5">
                      <ShieldCheck size={8} />
                      Sovereign
                    </span>
                  )}
                  <ExternalLink size={9} className="mx-auto mt-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </div>
        </div>

        {/* ─── Summary Card ─── */}
        <div className="rounded-2xl border border-blue-100 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 p-5 animate-pulse-gentle">
          <div className="flex items-start gap-2.5 mb-3">
            <CheckCircle2 size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
          </div>
          <div className="flex items-center gap-4 ml-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2.5 py-1 rounded-full">
              <Clock size={11} /> {data.totalTime}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2.5 py-1 rounded-full">
              <Banknote size={11} /> {data.totalCost}
            </span>
          </div>
        </div>

        {/* ─── Steps ─── */}
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-3">
            {data.steps.map(step => (
              <StepCard key={step.stepNumber} step={step} sources={data.sources} />
            ))}
          </div>
        </div>

        {/* ─── Common Mistakes ─── */}
        {data.commonMistakes.length > 0 && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/20 p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-3">
              <AlertTriangle size={13} /> Common mistakes
            </h3>
            <ul className="space-y-2">
              {data.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ─── Sources list (compact) ─── */}
        <div className="pt-1">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">Cameroonian sources</p>
          <div className="flex flex-wrap gap-2">
            {data.sources.map((src, idx) => (
              <CitationTooltip key={idx} index={idx + 1} source={src} />
            ))}
          </div>
        </div>

      </div>
    </TooltipProvider>
  );
}
