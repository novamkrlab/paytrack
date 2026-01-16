/**
 * Chatbot API - Backend Entegrasyonu
 */

import { trpc } from './trpc';
import type { ChatRequest, ChatResponse } from '@/types/chatbot';

/**
 * Chatbot mutation hook'unu dışa aktar
 * Kullanım: const mutation = useChatMutation();
 *          mutation.mutate({ message: '...', context: {...} });
 */
export function useChatMutation() {
  return trpc.chat.sendMessage.useMutation();
}

/**
 * Örnek soruları al
 */
export function getSampleQuestions(language: 'tr' | 'en'): string[] {
  const questions = {
    tr: [
      'Borcum var, yatırım yapmalı mıyım?',
      'Acil fon ne kadar olmalı?',
      'FIRE nedir?',
      'Tasarruf oranım düşük, ne yapmalıyım?',
      'Hangi yatırım aracını seçmeliyim?',
    ],
    en: [
      'Should I invest if I have debt?',
      'How much should my emergency fund be?',
      'What is FIRE?',
      'My savings rate is low, what should I do?',
      'Which investment vehicle should I choose?',
    ],
  };

  return questions[language] || questions.tr;
}
