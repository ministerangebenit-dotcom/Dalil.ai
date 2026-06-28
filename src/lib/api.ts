import { mockFetchResponse } from '../data/mock-responses';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string
  || 'https://dalilai-app.up.railway.app';

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
  console.log('[Dalil] Calling backend:', BACKEND_URL);

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
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[Dalil] Backend response received:', data);

    if (!data.answer || typeof data.answer !== 'object') {
      throw new Error('Malformed response from backend');
    }

    const answer = data.answer;

    return {
      sovereignVerified: answer.sovereignVerified ?? false,
      summary: answer.summary ?? 'Réponse reçue.',
      totalTime: answer.totalTime ?? null,
      totalCost: answer.totalCost ?? null,
      steps: Array.isArray(answer.steps) ? answer.steps : [],
      commonMistakes: Array.isArray(answer.commonMistakes) ? answer.commonMistakes : [],
      sources: Array.isArray(answer.sources) ? answer.sources : [],
    };

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('[Dalil] Request timed out — falling back to mock');
    } else {
      console.warn('[Dalil] Backend unreachable:', error.message, '— falling back to mock');
    }
    return mockFetchResponse(message) as unknown as DalilResponse;
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    console.log('[Dalil] Health check:', data);
    return data.status === 'healthy';
  } catch (err) {
    console.warn('[Dalil] Health check failed:', err);
    return false;
  }
}
