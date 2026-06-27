import { StepCard } from './StepCard';
import { CitationChip } from './CitationTooltip';
import { TooltipProvider } from '../ui/tooltip';
import { Clock, Banknote, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import type { Language } from '../../lib/i18n';
import { t } from '../../lib/i18n';

interface Source { title: string; url: string; snippet: string; domain: string; isOfficial: boolean; }
interface Step { stepNumber: number; title: string; description: string; documents: string[]; time: string; cost: string; risk: string; sources: number[]; type?: 'standard' | 'law' | 'contact'; }
interface ProceduralData { summary: string; totalTime: string; totalCost: string; steps: Step[]; commonMistakes: string[]; sources: Source[]; sovereignVerified: boolean; }

export function ProceduralAnswer({ data, lang }: { data: ProceduralData; lang: Language }) {
  const allSovereign = data.sources.every(s => s.isOfficial);

  return (
    <TooltipProvider>
      <div className="space-y-4 w-full">
        {allSovereign && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
            <Shield size={13} color="#fbbf24" className="shrink-0" />
            <span className="text-xs font-semibold gold-text tracking-wide">{t(lang, 'sovereign_verified')}</span>
          </div>
        )}

        <div className="glass-card p-5">
          <div className="flex items-start gap-2.5 mb-4">
            <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-sm text-white leading-relaxed">{data.summary}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Clock size={10} /> {data.totalTime}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium gold-text px-3 py-1.5 rounded-full" style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
              <Banknote size={10} /> {data.totalCost}
            </span>
          </div>
        </div>

        {/* Bento sources */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2.5 px-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{t(lang, 'verified_sources')}</p>
          <div className="bento-grid">
            {data.sources.map((src, idx) => (
              <a key={idx} href={src.url} target="_blank" rel="noopener noreferrer"
                className={`source-chip no-underline ${src.isOfficial ? 'official' : ''}`}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono shrink-0"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'hsl(var(--muted-foreground))' }}>
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium text-white truncate">{src.domain}</p>
                  {src.isOfficial && (
                    <p className="text-[9px] gold-text flex items-center gap-0.5 mt-0.5">
                      <Shield size={8} /> {t(lang, 'official')}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {data.steps.map(step => (
            <StepCard key={step.stepNumber} step={step} sources={data.sources} lang={lang} />
          ))}
        </div>

        {data.commonMistakes.length > 0 && (
          <div className="rounded-xl p-4" style={{ border: '1px solid rgba(251,191,36,0.2)', background: 'rgba(251,191,36,0.04)' }}>
            <h3 className="flex items-center gap-2 text-[10px] font-semibold gold-text uppercase tracking-widest mb-3">
              <AlertTriangle size={12} /> {t(lang, 'common_mistakes')}
            </h3>
            <ul className="space-y-2">
              {data.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--gold)' }} />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{t(lang, 'citations')}</p>
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
