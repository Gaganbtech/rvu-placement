/**
 * Okapi BM25 Sparse Lexical Retrieval Engine
 * 
 * Formula:
 *  Score(D, Q) = \sum_{q_i \in Q} IDF(q_i) \cdot \frac{f(q_i, D) \cdot (k_1 + 1)}{f(q_i, D) + k_1 \cdot (1 - b + b \cdot \frac{|D|}{\text{avgdl}})}
 */

import type { KnowledgeChunk } from './types';

const K1 = 1.2;
const B = 0.75;

export interface BM25DocStats {
  id: string;
  terms: Map<string, number>;
  length: number;
}

export class BM25Index {
  private docStats: BM25DocStats[] = [];
  private docFrequency: Map<string, number> = new Map();
  private totalDocs = 0;
  private avgDocLength = 0;

  constructor(chunks: KnowledgeChunk[] = []) {
    this.buildIndex(chunks);
  }

  public tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  public buildIndex(chunks: KnowledgeChunk[]): void {
    this.docStats = [];
    this.docFrequency.clear();
    this.totalDocs = chunks.length;

    let totalLength = 0;

    for (const chunk of chunks) {
      const fullText = `${chunk.title} ${chunk.keywords.join(' ')} ${chunk.content}`;
      const tokens = this.tokenize(fullText);
      const termMap = new Map<string, number>();

      for (const t of tokens) {
        termMap.set(t, (termMap.get(t) || 0) + 1);
      }

      this.docStats.push({
        id: chunk.id,
        terms: termMap,
        length: tokens.length
      });

      totalLength += tokens.length;

      // Update document frequency
      for (const term of termMap.keys()) {
        this.docFrequency.set(term, (this.docFrequency.get(term) || 0) + 1);
      }
    }

    this.avgDocLength = this.totalDocs > 0 ? totalLength / this.totalDocs : 1;
  }

  /**
   * Computes Inverse Document Frequency (IDF) with smoothing.
   */
  private computeIdf(term: string): number {
    const df = this.docFrequency.get(term) || 0;
    return Math.log(1 + (this.totalDocs - df + 0.5) / (df + 0.5));
  }

  /**
   * Scores a query against all indexed documents using Okapi BM25.
   */
  public search(query: string): Map<string, number> {
    const queryTokens = this.tokenize(query);
    const scores = new Map<string, number>();

    if (queryTokens.length === 0 || this.totalDocs === 0) {
      return scores;
    }

    for (const doc of this.docStats) {
      let score = 0;
      const docLen = doc.length;
      const lenNorm = 1 - B + B * (docLen / (this.avgDocLength || 1));

      for (const token of queryTokens) {
        const tf = doc.terms.get(token) || 0;
        if (tf > 0) {
          const idf = this.computeIdf(token);
          const numerator = tf * (K1 + 1);
          const denominator = tf + K1 * lenNorm;
          score += idf * (numerator / denominator);
        }
      }

      if (score > 0) {
        scores.set(doc.id, score);
      }
    }

    return scores;
  }
}
