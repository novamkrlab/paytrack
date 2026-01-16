/**
 * Chatbot Hazır Cevaplar (Sık Sorulan Sorular)
 */

export interface QuickReply {
  id: string;
  question: string;
  answer: string;
  category: 'debt' | 'savings' | 'investment' | 'fire' | 'emergency';
}

export const quickReplies: QuickReply[] = [
  {
    id: 'debt-vs-investment',
    question: 'chatbot.quickReplies.debtVsInvestment.question',
    answer: 'chatbot.quickReplies.debtVsInvestment.answer',
    category: 'debt',
  },
  {
    id: 'emergency-fund',
    question: 'chatbot.quickReplies.emergencyFund.question',
    answer: 'chatbot.quickReplies.emergencyFund.answer',
    category: 'emergency',
  },
  {
    id: 'savings-rate',
    question: 'chatbot.quickReplies.savingsRate.question',
    answer: 'chatbot.quickReplies.savingsRate.answer',
    category: 'savings',
  },
  {
    id: 'fire-basics',
    question: 'chatbot.quickReplies.fireBasics.question',
    answer: 'chatbot.quickReplies.fireBasics.answer',
    category: 'fire',
  },
  {
    id: 'investment-start',
    question: 'chatbot.quickReplies.investmentStart.question',
    answer: 'chatbot.quickReplies.investmentStart.answer',
    category: 'investment',
  },
  {
    id: 'debt-payoff',
    question: 'chatbot.quickReplies.debtPayoff.question',
    answer: 'chatbot.quickReplies.debtPayoff.answer',
    category: 'debt',
  },
];

/**
 * Kategori bazında hazır cevapları filtrele
 */
export function getQuickRepliesByCategory(category: QuickReply['category']): QuickReply[] {
  return quickReplies.filter(reply => reply.category === category);
}

/**
 * Tüm hazır cevapları getir
 */
export function getAllQuickReplies(): QuickReply[] {
  return quickReplies;
}
