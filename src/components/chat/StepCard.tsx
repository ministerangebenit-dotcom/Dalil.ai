import { FileText, Clock, Banknote, AlertCircle, ScrollText, Phone } from 'lucide-react';
import { CitationChip } from './CitationTooltip';

interface Source { title: string; url: string; snippet: string; domain: string; isOfficial: boolean; }
interface Step { stepNumber: number; title: string; description: string; documents: string[]; time: string; cost: string; risk: string; sources: number[]; type?: 'standard' | 'law' | 'contact'; }

export function StepCard({ step, sources }: { step: Step; sources: Source[] }) {
  const isLaw = step.type === 'law';
  const isContact = step.type === 'contact';

  return (
    <div className="relative flex gap-4">
      <div className="relative z-10 w-10 h-10 rounded-xl bg-[var(--gold-dim)] border border-[var(--gold-border)] flex items-center justify-center shrink-0 font-semibold text-sm gold-text">
        {step.stepNumber}
      </div>
      <div className={`flex-1 mb-1 p-4 transition-all hover:border-[var(--gold-border)] ${isLaw ? 'law-card' : isContact ? 'contact-card' : 'glass-card'}`}>
        <div className="flex items-center gap-2 mb-2">
          {isLaw && <ScrollText size={12} className="gold-text" />}
          {isContact && <Phone size={12} className="text-emerald-400" />}
          <h4 className="font-semibold text-sm text-white">{step.title}</h4>
          {isLaw && <span className="text-[9px] sovereign-badge ml-auto">Legal Decree</span>}
          {isContact && <span className="text-[9px] bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto">Official Contact</span>}
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed mb-3">{step.description}</p>

        {step.documents.length > 0 && (
          <div className="flex items-start gap-2 mb-3 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)]">
            <FileText size={11} className="text-[hsl(var(--muted-foreground))] mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-[9px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-2">Required documents</p>
              <div className="flex flex-wrap gap-1.5">
                {step.documents.map((doc, i) => (
                  <span key={i} className="text-[10px] bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white px-2 py-0.5 rounded-md">{doc}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
            <Clock size={10} /> {step.time}
          </span>
          <span className="w-px h-3 bg-[var(--glass-border)]" />
          <span className="inline-flex items-center gap-1 text-[10px] gold-text">
            <Banknote size={10} /> {step.cost}
          </span>
        </div>

        {step.risk && (
          <div className="flex items-start gap-2 text-[10px] text-amber-300 bg-[rgba(251,191,36,0.06)] border border-[rgba(251,191,36,0.2)] p-2.5 rounded-lg mb-3">
            <AlertCircle size={11} className="mt-0.5 shrink-0" />
            <span>{step.risk}</span>
          </div>
        )}

        {step.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {step.sources.map(srcIdx => (
              <CitationChip key={srcIdx} index={srcIdx} source={sources[srcIdx - 1]} small />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
