/**
 * Google Gemini API Client & Grounded LLM Synthesizer for Production RAG
 */

import { GoogleGenAI } from '@google/genai';
import type { UserRoleContext } from './types';
import type { RetrievedCandidate } from './hybridRetriever';

const GEMINI_API_KEY_STORAGE = 'rvu_gemini_api_key_override';

export function getActiveGeminiApiKey(): string | null {
  if (typeof window !== 'undefined') {
    const userKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    if (userKey && userKey.trim().length > 10) return userKey.trim();
  }
  // Check import.meta.env
  try {
    return (import.meta as any).env?.VITE_GEMINI_API_KEY || null;
  } catch {
    return null;
  }
}

export function setGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(GEMINI_API_KEY_STORAGE);
    }
  }
}

/**
 * Synthesizes a response using Google Gemini 2.5 Flash grounded on retrieved chunks.
 */
export async function synthesizeWithGemini(
  query: string,
  retrievedChunks: RetrievedCandidate[],
  role: UserRoleContext
): Promise<string | null> {
  const apiKey = getActiveGeminiApiKey();
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });

    const contextText = retrievedChunks
      .map(
        (c, i) =>
          `[Source ${i + 1}: ${c.chunk.title} (${c.chunk.sourceDoc})]\n${c.chunk.content}`
      )
      .join('\n\n');

    const systemInstruction = `You are the official RV University Placement & Career AI Assistant.
ROLE CONTEXT: Answering for a ${role.toUpperCase()}.
CRITICAL CONSTRAINTS:
1. Ground your answer ONLY on the provided verified sources below.
2. If the user asks for recruiter direct phone numbers, personal emails, or WhatsApp contacts, DO NOT provide them. State that direct contact info is confidential and handled via the Placement Cell.
3. Keep the response SHORT, PRECISE, and CONCISE (2 to 4 crisp bullet points maximum). Avoid introductory or concluding conversational fluff.
4. If the required information is missing from the sources, state: "Information not available in verified placement records. Please contact the Placement Cell (placements@rvu.edu.in)."`;

    const prompt = `VERIFIED RETRIEVED SOURCES:\n${contextText}\n\nUSER QUESTION: ${query}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.1, // High precision, deterministic
        maxOutputTokens: 256
      }
    });

    if (response && response.text) {
      return response.text.trim();
    }
    return null;
  } catch (err) {
    console.warn('Gemini API query failed or key invalid, falling back to local grounded synthesis:', err);
    return null;
  }
}
