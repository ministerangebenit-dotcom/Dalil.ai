import { FileText, Clock, Banknote, AlertCircle } from 'lucide-react';
import { CitationTooltip } from './CitationTooltip';

interface Source { title: string; url: string; snippet: string; }
interface Step { stepNumber: number; title: string; description: string; documents: string[]; time: string; cost: string; risk: string; sources: number[]; }

export function StepCard({ step, sources }: { step: Step; sources: Source[] }) {
  return (
    <div className="relative flex gap-4">
      <div className="relative z-10 w-10 h-10 rounded-xl bg-background border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0 font-semibold text-sm text-blue-600">
        {step.stepNumber}
      </div>
      <div className="flex-1 mb-1 bg-[var(--dalil-surface)] border border-border rounded-2xl p-4 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
        <h4 className="font-semibold text-sm text-foreground mb-1.5">{step.title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.description}</p>

        {step.documents.length > 0 && (
          <div className="flex items-start gap-2 mb-3 p-3 rounded-lg bg-background border border-border">
            <FileText size={13} className="text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Required documents</p>
              <div className="flex flex-wrap gap-1.5">
                {step.documents.map((doc, i) => (
                  <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">{doc}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={11} /> {step.time}
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Banknote size={11} /> {step.cost}
          </span>
        </div>

        {step.risk && (
          <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-2.5 rounded-lg mb-3">
            <AlertCircle size={12} className="mt-0.5 shrink-0" />
            <span>{step.risk}</span>
          </div>
        )}

        <div className="flex gap-1.5">
          {step.sources.map(srcIdx => (
            <CitationTooltip key={srcIdx} index={srcIdx} source={sources[srcIdx - 1]} />
          ))}
        </div>
      </div>
    </div>
  );
}
