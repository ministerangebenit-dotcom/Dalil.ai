import { mockFetchResponse } from '../data/mock-responses';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://dalilai-app.up.railway.app';

export interface DalilResponse {
  sovereignVerified: boolean;
  summary: string;
  totalTime: string | null;
  totalCost: string | null;
  steps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    documents: string[];
    time: string;
    cost: string;
    risk: string;
    sources: number[];
    type?: 'standard' | 'law' | 'contact';
  }>;
  commonMistakes: string[];
  sources: Array<{
    title: string;
    url: string;
    snippet: string;
    domain: string;
    isOfficial: boolean;
  }>;
}

export async function queryDalil(
  message: string,
  language: string = 'fr'
): Promise<DalilResponse> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, language }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();

    // Validate structure — fallback to mock if malformed
    if (!data.answer || typeof data.answer !== 'object') {
      throw new Error('Malformed response from backend');
    }

    const answer = data.answer;

    // Ensure required fields exist
    return {
      sovereignVerified: answer.sovereignVerified ?? false,
      summary: answer.summary ?? 'Réponse reçue.',
      totalTime: answer.totalTime ?? null,
      totalCost: answer.totalCost ?? null,
      steps: Array.isArray(answer.steps) ? answer.steps : [],
      commonMistakes: Array.isArray(answer.commonMistakes) ? answer.commonMistakes : [],
      sources: Array.isArray(answer.sources) ? answer.sources : [],
    };

  } catch (error) {
    console.warn('[Dalil] Backend unreachable, using mock fallback:', error);
    // Graceful fallback to mock during demo
    return mockFetchResponse(message) as DalilResponse;
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { method: 'GET' });
    const data = await res.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}
