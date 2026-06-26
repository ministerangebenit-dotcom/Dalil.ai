import { StepCard } from './StepCard';
import { CitationTooltip } from './CitationTooltip';
import { TooltipProvider } from '../ui/tooltip';
import { Clock, Banknote, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Source { title: string; url: string; snippet: string; }
interface Step { stepNumber: number; title: string; description: string; documents: string[]; time: string; cost: string; risk: string; sources: number[]; }
interface ProceduralData { summary: string; totalTime: string; totalCost: string; steps: Step[]; commonMistakes: string[]; sources: Source[]; }

export function ProceduralAnswer({ data }: { data: ProceduralData }) {
  return (
    <TooltipProvider>
      <div className="space-y-4 w-full">
        <div className="rounded-2xl border border-blue-100 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 p-5">
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

        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-3">
            {data.steps.map(step => (
              <StepCard key={step.stepNumber} step={step} sources={data.sources} />
            ))}
          </div>
        </div>

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
