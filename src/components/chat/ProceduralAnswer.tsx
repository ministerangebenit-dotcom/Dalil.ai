import { StepCard } from './StepCard';
import { CitationChip } from './CitationTooltip';
import { TooltipProvider } from '../ui/tooltip';
import { Clock, Banknote, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';

interface Source { title: string; url: string; snippet: string; domain: string; isOfficial: boolean; }
interface Step { stepNumber: number; title: string; description: string; documents: string[]; time: string; cost: string; risk: string; sources: number[]; type?: 'standard' | 'law' | 'contact'; }
interface ProceduralData { summary: string; totalTime: string; totalCost: string; steps: Step[]; commonMistakes: string[]; sources: Source[]; sovereignVerified: boolean; }

export function ProceduralAnswer({ data }: { data: ProceduralData }) {
  const officialSources = data.sources.filter(s => s.isOfficial);
  const allSovereign = data.sources.every(s => s.isOfficial);

  return (
    <TooltipProvider>
      <div className="space-y-4 w-full">
        {/* Sovereign verified banner */}
        {allSovereign && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--gold-dim)] border border-[var(--gold-border)]">
            <Shield size={13} className="gold-text shrink-0" />
            <span className="text-xs font-semibold gold-text tracking-wide">SOVEREIGN VERIFIED — all sources are official Cameroonian repositories</span>
          </div>
        )}

        {/* Summary glass card */}
        <div className="glass-card p-5">
          <div className="flex items-start gap-2.5 mb-4">
            <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-sm text-white leading-relaxed">{data.summary}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] px-3 py-1.5 rounded-full">
              <Clock size={10} /> {data.totalTime}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium gold-text bg-[var(--gold-dim)] border border-[var(--gold-border)] px-3 py-1.5 rounded-full">
              <Banknote size={10} /> {data.totalCost}
            </span>
          </div>
        </div>

        {/* Bento sources grid */}
        <div>
          <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-2.5 px-1">Verified sources</p>
          <div className="bento-grid">
            {data.sources.map((src, idx) => (
              <a key={idx} href={src.url} target="_blank" rel="noopener noreferrer"
                className={`source-chip ${src.isOfficial ? 'official' : ''} no-underline`}>
                <div className="w-6 h-6 rounded-md bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[10px] font-mono text-[hsl(var(--muted-foreground))] shrink-0">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium text-white truncate">{src.domain}</p>
                  {src.isOfficial && (
                    <p className="text-[9px] gold-text flex items-center gap-0.5 mt-0.5">
                      <Shield size={8} /> Official
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Steps with timeline */}
        <div className="relative">
          <div className="space-y-3">
            {data.steps.map(step => (
              <StepCard key={step.stepNumber} step={step} sources={data.sources} />
            ))}
          </div>
        </div>

        {/* Common mistakes */}
        {data.commonMistakes.length > 0 && (
          <div className="rounded-xl border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.04)] p-4">
            <h3 className="flex items-center gap-2 text-[10px] font-semibold gold-text uppercase tracking-widest mb-3">
              <AlertTriangle size={12} /> Common mistakes to avoid
            </h3>
            <ul className="space-y-2">
              {data.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="w-1 h-1 rounded-full bg-[var(--gold)] mt-1.5 shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Inline citation chips */}
        <div>
          <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-2.5">Citations</p>
          <div className="flex flex-wrap gap-2">
            {data.sources.map((src, idx) => (
              <CitationChip key={idx} index={idx + 1} source={src} />
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
