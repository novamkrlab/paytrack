/**
 * Chatbot - Veri Modelleri
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatRequest {
  message: string;
  context?: {
    monthlyIncome: number;
    monthlyExpenses: number;
    totalDebt: number;
    currentSavings: number;
    healthScore: number;
  };
}

export interface ChatResponse {
  reply: string;
  suggestions?: string[];
}
