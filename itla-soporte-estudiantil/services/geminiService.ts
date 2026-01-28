// src/services/geminiService.ts
//
// IMPORTANTE:
// - NO uses Gemini desde el navegador con una API key (se expone y te la roban).
// - En su lugar, llama a tu backend (AIController) que sí tiene GEMINI_API_KEY en .env del servidor.
//

import { api } from './api';

export type TicketAIResult = {
  category?: string;
  priority?: 'Baja' | 'Media' | 'Alta' | string;
  summary?: string;
  message?: string;
};

export const analyzeTicketDescription = async (description: string): Promise<TicketAIResult | null> => {
  try {
    // Backend esperado: POST /ai/analyze  { text: string }
    const res = await api.post<TicketAIResult>('/ai/analyze', { text: description });
    return res ?? null;
  } catch (error) {
    console.error('AI analyze failed:', error);
    return null;
  }
};

export const getSmartResponse = async (description: string): Promise<string> => {
  try {
    // Si no tienes este endpoint, puedes dejarlo así (fallback abajo).
    const res = await api.post<{ text?: string; message?: string }>('/ai/smart-response', { text: description });
    return res?.text || res?.message || 'Tu solicitud ha sido recibida. Un técnico la revisará pronto.';
  } catch {
    return 'Tu solicitud ha sido recibida. Un técnico la revisará pronto.';
  }
};
