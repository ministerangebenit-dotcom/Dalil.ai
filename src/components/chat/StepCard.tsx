import { Card, CardContent } from '../ui/card';
import { FileText, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { CitationTooltip } from './CitationTooltip';

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

export function StepCard({ step, sources }: { step: Step; sources: Source[] }) {
  return (
    <Card className="border-gray-100 hover:shadow-sm transition-shadow">
      <CardContent className="p-5">
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">
            {step.stepNumber}
          </div>
          <div className="space-y-3 flex-1">
            <h4 className="font-semibold text-gray-900">{step.title}</h4>
            <p className="text-gray-600 text-sm">{step.description}</p>
            
            {step.documents.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="font-medium text-gray-700">Required docs:</span>{' '}
                  <span>{step.documents.join(', ')}</span>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {step.time}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" /> {step.cost}
              </span>
            </div>
            
            {step.risk && (
              <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
                <AlertCircle className="h-3.5 w-3.5 mt-0.5" />
                <span>{step.risk}</span>
              </div>
            )}
            
            <div className="flex gap-1">
              {step.sources.map((srcIdx) => (
                <CitationTooltip key={srcIdx} index={srcIdx} source={sources[srcIdx - 1]} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
