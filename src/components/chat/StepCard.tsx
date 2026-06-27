import { FileText, Clock, Banknote, AlertCircle, ScrollText, Phone } from 'lucide-react';
import { CitationChip } from './CitationTooltip';
import type { Language } from '../../lib/i18n';
import { t } from '../../lib/i18n';

interface Source { title: string; url: string; snippet: string; domain: string; isOfficial: boolean; }
interface Step { stepNumber: number; title: string; description: string; documents: string[]; time: string; cost: string; risk: string; sources: number[]; type?: 'standard' | 'law' | 'contact'; }

export function StepCard({ step, sources, lang }: { step: Step; sources: Source[]; lang: Language }) {
  const isLaw = step.type === 'law';
  const isContact = step.type === 'contact';

  const cardStyle = isLaw
    ? { background: 'rgba(251,191,36,0.05)', border: '1px solid var(--gold-border)', borderRadius: 12 }
    : isContact
    ? { background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12 }
    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', borderRadius: 12 };

  return (
    <div className="relative flex gap-4">
      <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-semibold text-sm gold-text"
        style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
        {step.stepNumber}
      </div>
      <div className="flex-1 mb-1 p-4 transition-all" style={cardStyle}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = isLaw ? 'var(--gold-border)' : isContact ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}
      >
        <div className="flex items-center gap-2 mb-2">
          {isLaw && <ScrollText size={12} color="#fbbf24" />}
          {isContact && <Phone size={12} className="text-emerald-400" />}
          <h4 className="font-semibold text-sm text-white">{step.title}</h4>
          {isLaw && <span className="sovereign-badge ml-auto">{t(lang, 'legal_decree')}</span>}
          {isContact && (
            <span className="text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-auto font-semibold"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
              {t(lang, 'official_contact')}
            </span>
          )}
        </div>

        <p className="text-xs leading-relaxed mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>{step.description}</p>

        {step.documents.length > 0 && (
          <div className="flex items-start gap-2 mb-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
            <FileText size={11} className="shrink-0 mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }} />
            <div className="flex-1">
              <p className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>{t(lang, 'required_docs')}</p>
              <div className="flex flex-wrap gap-1.5">
                {step.documents.map((doc, i) => (
                  <span key={i} className="text-[10px] text-white px-2 py-0.5 rounded-md" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>{doc}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <Clock size={10} /> {step.time}
          </span>
          <span className="w-px h-3" style={{ background: 'var(--glass-border)' }} />
          <span className="inline-flex items-center gap-1 text-[10px] gold-text">
            <Banknote size={10} /> {step.cost}
          </span>
        </div>

        {step.risk && (
          <div className="flex items-start gap-2 text-[10px] p-2.5 rounded-lg mb-3"
            style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', color: '#fca5a5' }}>
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
