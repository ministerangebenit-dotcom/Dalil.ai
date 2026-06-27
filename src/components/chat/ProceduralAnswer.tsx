import { StepCard } from './StepCard';
import { CitationChip } from './CitationTooltip';
import { TooltipProvider } from '../ui/tooltip';
import { Clock, Banknote, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import type { Language } from '../../lib/i18n';
import { t } from '../../lib/i18n';

interface Source { title: string; url: string; snippet: string; domain: string; isOfficial: boolean; }
interface Step { stepNumber: number; title: string; description: string; documents: string[]; time: string; cost: string; risk: string; sources: number[]; type?: 'standard' | 'law' | 'contact'; }
interface ProceduralData { summary: string; totalTime: string; totalCost: string; steps: Step[]; commonMistakes: string[]; sources: Source[]; sovereignVerified: boolean; }

interface Props {
  data: ProceduralData;
  lang: Language;
  streaming?: boolean;
  streamedSummary?: string;
}

export function ProceduralAnswer({ data, lang, streaming, streamedSummary }: Props) {
  const allSovereign = data.sources.every(s => s.isOfficial);
  const displayedSummary = streaming ? (streamedSummary ?? '') : data.summary;

  return (
    <TooltipProvider>
      <div className="procedural-answer">
        {/* Sovereign banner */}
        {allSovereign && !streaming && (
          <div className="sovereign-banner">
            <Shield size={13} color="#fbbf24" />
            <span>{t(lang, 'sovereign_verified')}</span>
          </div>
        )}

        {/* Summary card */}
        <div className="glass-card summary-card">
          <div className="summary-content">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" style={{ marginTop: 2 }} />
            <p className="summary-text">
              {displayedSummary}
              {streaming && <span className="cursor-blink">▌</span>}
            </p>
          </div>
          {!streaming && (
            <div className="summary-meta">
              <span className="meta-badge green">
                <Clock size={10} /> {data.totalTime}
              </span>
              <span className="meta-badge gold">
                <Banknote size={10} /> {data.totalCost}
              </span>
            </div>
          )}
        </div>

        {/* Rest only when streaming done */}
        {!streaming && (
          <>
            {/* Bento sources */}
            <div>
              <p className="section-label">{t(lang, 'verified_sources')}</p>
              <div className="bento-grid">
                {data.sources.map((src, idx) => (
                  <a key={idx} href={src.url} target="_blank" rel="noopener noreferrer"
                    className={`source-chip no-underline ${src.isOfficial ? 'official' : ''}`}>
                    <div className="source-num">{idx + 1}</div>
                    <div className="source-info">
                      <p className="source-domain">{src.domain}</p>
                      {src.isOfficial && (
                        <p className="source-official">
                          <Shield size={8} /> {t(lang, 'official')}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="steps-list">
              {data.steps.map(step => (
                <StepCard key={step.stepNumber} step={step} sources={data.sources} lang={lang} />
              ))}
            </div>

            {/* Mistakes */}
            {data.commonMistakes.length > 0 && (
              <div className="mistakes-card">
                <h3 className="mistakes-title">
                  <AlertTriangle size={12} /> {t(lang, 'common_mistakes')}
                </h3>
                <ul className="mistakes-list">
                  {data.commonMistakes.map((m, i) => (
                    <li key={i} className="mistake-item">
                      <span className="mistake-dot" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Citations */}
            <div>
              <p className="section-label">{t(lang, 'citations')}</p>
              <div className="citations-row">
                {data.sources.map((src, idx) => (
                  <CitationChip key={idx} index={idx + 1} source={src} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
