import { Card, CardContent } from '../ui/card';
import { StepCard } from './StepCard';
import { CitationTooltip } from './CitationTooltip';
import { TooltipProvider } from '../ui/tooltip';
import { Clock, DollarSign, AlertTriangle } from 'lucide-react';

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
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <Card className="bg-gradient-to-r from-blue-50 to-white border-blue-100">
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

        <div className="space-y-3">
          {data.steps.map((step) => (
            <StepCard key={step.stepNumber} step={step} sources={data.sources} />
          ))}
        </div>

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

        <div className="text-xs text-muted-foreground">
          <h4 className="font-medium text-gray-600 mb-2">Sources</h4>
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
