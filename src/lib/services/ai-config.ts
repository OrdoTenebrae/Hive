import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export const gemini = process.env.GOOGLE_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null;

export const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const getAIClient = (tier: 'free' | 'paid', taskComplexity: 'low' | 'high' = 'low') => {
  // Only use OpenAI for paid users with high complexity tasks
  if (tier === 'paid' && taskComplexity === 'high' && openai) {
    return 'openai';
  }
  // Use Gemini for everything else
  return 'gemini';
}; 