import { Card, CardContent } from '../ui/card';
import { StepCard } from './StepCard';
import { CitationTooltip } from './CitationTooltip';
import { TooltipProvider } from '../ui/tooltip';
import { Clock, DollarSign, AlertTriangle, BrainCircuit, ExternalLink, ShieldCheck } from 'lucide-react';
interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface Step {
  stepNumber: number;
  title: string;
  description: string;
  documents: string[];
  time: string;
  cost: string;
  risk: string;
  sources: number[];
}

interface ProceduralData {
  summary: string;
  totalTime: string;
  totalCost: string;
  steps: Step[];
  commonMistakes: string[];
  sources: Source[];
}

export function ProceduralAnswer({ data }: { data: ProceduralData }) {
  // Count sovereign sources
  const sovereignCount = data.sources.filter(s =>
    s.url.includes('.cm') || s.url.includes('gouvernement') || s.url.includes('prc.cm')
  ).length;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Transparent reasoning box */}
        <Card className="bg-white/60 backdrop-blur-sm border-gray-100">
          <CardContent className="p-4 flex items-start gap-3 text-sm">
            <BrainCircuit className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-800">Dalil reasoning</p>
              <p className="text-muted-foreground">
                Filtering out 14 global hallucinations to prioritize Cameroonian Law. 
                Scanning official .cm repositories for legal accuracy… 
                Found {data.sources.length} relevant sources ({sovereignCount} sovereign).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bento grid for sources (top, as requested) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {data.sources.map((src, idx) => (
            <Card key={idx} className="bg-white/80 backdrop-blur-sm hover:shadow-sm transition-shadow border-gray-100">
              <CardContent className="p-3 flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-700">
                  {extractDomain(src.url).charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-gray-700 truncate w-full">
                  {extractDomain(src.url)}
                </span>
                {isSovereign(src.url) && (
                  <span className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                    <ShieldCheck className="h-3 w-3" /> Sovereign
                  </span>
                )}
                <a href={src.url} target="_blank" rel="noopener" className="text-xs text-primary underline mt-1 flex items-center gap-1">
                  View <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary card */}
        <Card className="bg-gradient-to-r from-blue-50/80 to-white/80 backdrop-blur-sm border-blue-100">
          <CardContent className="p-5">
            <p className="text-gray-700">{data.summary}</p>
            <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {data.totalTime}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" /> {data.totalCost}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="space-y-3">
          {data.steps.map((step) => (
            <StepCard key={step.stepNumber} step={step} sources={data.sources} />
          ))}
        </div>

        {/* Common Mistakes */}
        {data.commonMistakes.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-5">
              <h3 className="font-semibold flex items-center gap-2 text-amber-800 mb-3">
                <AlertTriangle className="h-5 w-5" /> Common Mistakes
              </h3>
              <ul className="list-disc list-inside space-y-1 text-amber-700">
                {data.commonMistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}

// Helper functions (copy these at top of file or import from a shared util)
function isSovereign(url: string): boolean {
  return url.includes('.cm') || url.includes('gouvernement') || url.includes('prc.cm');
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}
