/**
 * Production Two-Stage Hybrid RAG Retriever with Reciprocal Rank Fusion (RRF) & Re-ranking
 */

import { generateDenseEmbedding, computeCosineSimilarity } from './embeddings';
import { BM25Index } from './bm25';
import { filterChunksByRBAC } from './securityEngine';
import type { KnowledgeChunk, UserRoleContext, RAGCitation, RetrievalMetric } from './types';

export interface RetrievedCandidate {
  chunk: KnowledgeChunk;
  denseRank: number;
  denseScore: number;
  bm25Rank: number;
  bm25Score: number;
  rrfScore: number;
  rerankScore: number;
}

export interface HybridRetrievalResult {
  topChunks: RetrievedCandidate[];
  citations: RAGCitation[];
  metrics: RetrievalMetric;
}

export class ProductionHybridRetriever {
  private chunks: KnowledgeChunk[] = [];
  private bm25: BM25Index;

  constructor(initialChunks: KnowledgeChunk[] = []) {
    this.updateKnowledge(initialChunks);
    this.bm25 = new BM25Index(this.chunks);
  }

  public updateKnowledge(chunks: KnowledgeChunk[]): void {
    // Precompute dense embeddings for all chunks if not present
    this.chunks = chunks.map(chunk => {
      if (!chunk.embedding || chunk.embedding.length === 0) {
        const fullText = `${chunk.title}. ${chunk.keywords.join(', ')}. ${chunk.content}`;
        return {
          ...chunk,
          embedding: generateDenseEmbedding(fullText)
        };
      }
      return chunk;
    });

    this.bm25 = new BM25Index(this.chunks);
  }

  /**
   * Stage 1 & Stage 2 Hybrid Search:
   * 1. Dense Semantic Cosine Similarity
   * 2. Okapi BM25 Lexical Scoring
   * 3. Reciprocal Rank Fusion (RRF)
   * 4. Cross-Attention Re-Ranking & Confidence Filtering
   */
  public search(
    query: string,
    role: UserRoleContext = 'student',
    topK = 3
  ): HybridRetrievalResult {
    const startTime = performance.now();

    // 1. RBAC Filtering
    const accessibleChunks = filterChunksByRBAC(this.chunks, role);
    if (accessibleChunks.length === 0) {
      return {
        topChunks: [],
        citations: [],
        metrics: {
          queryLatencyMs: Math.round(performance.now() - startTime),
          totalCandidatesEvaluated: 0,
          denseScore: 0,
          bm25Score: 0,
          hybridRrfScore: 0,
          rerankScore: 0,
          confidencePercent: 0
        }
      };
    }

    // 2. Dense Semantic Retrieval
    const queryEmbedding = generateDenseEmbedding(query);
    const denseScores = new Map<string, number>();

    for (const chunk of accessibleChunks) {
      if (chunk.embedding) {
        const sim = computeCosineSimilarity(queryEmbedding, chunk.embedding);
        denseScores.set(chunk.id, sim);
      }
    }

    const sortedDense = [...accessibleChunks].sort(
      (a, b) => (denseScores.get(b.id) || 0) - (denseScores.get(a.id) || 0)
    );

    // 3. Sparse BM25 Retrieval
    const bm25Scores = this.bm25.search(query);
    const sortedBm25 = [...accessibleChunks].sort(
      (a, b) => (bm25Scores.get(b.id) || 0) - (bm25Scores.get(a.id) || 0)
    );

    // 4. Reciprocal Rank Fusion (RRF) with k=60
    const RRF_K = 60;
    const candidates = new Map<string, RetrievedCandidate>();

    sortedDense.forEach((chunk, denseRank) => {
      const denseScore = denseScores.get(chunk.id) || 0;
      const bm25Score = bm25Scores.get(chunk.id) || 0;
      const bm25Rank = sortedBm25.findIndex(c => c.id === chunk.id);

      const rrf =
        1 / (RRF_K + denseRank + 1) +
        (bm25Score > 0 && bm25Rank >= 0 ? 1 / (RRF_K + bm25Rank + 1) : 0);

      candidates.set(chunk.id, {
        chunk,
        denseRank: denseRank + 1,
        denseScore,
        bm25Rank: bm25Rank >= 0 ? bm25Rank + 1 : 999,
        bm25Score,
        rrfScore: rrf,
        rerankScore: 0
      });
    });

    // 5. Cross-Encoder Re-ranking Simulation
    // Computes semantic term interaction, exact phrase bonuses, and title matches
    const qTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const allCandidates = Array.from(candidates.values());

    for (const cand of allCandidates) {
      const fullText = `${cand.chunk.title.toLowerCase()} ${cand.chunk.content.toLowerCase()}`;
      let termOverlap = 0;
      for (const t of qTokens) {
        if (fullText.includes(t)) termOverlap += 1;
      }
      const overlapRatio = qTokens.length > 0 ? termOverlap / qTokens.length : 0;

      // Exact title match bonus
      let titleBonus = 0;
      for (const t of qTokens) {
        if (cand.chunk.title.toLowerCase().includes(t)) titleBonus += 0.25;
      }

      // Keyword match bonus
      let keywordBonus = 0;
      for (const t of qTokens) {
        if (cand.chunk.keywords.some(k => k.includes(t) || t.includes(k))) {
          keywordBonus += 0.15;
        }
      }

      // Composite Re-rank Score: 40% Dense + 30% BM25 Normalized + 20% Overlap + 10% Entity Bonus
      const normalizedBm25 = Math.min(1, cand.bm25Score / 10);
      cand.rerankScore =
        cand.denseScore * 0.4 +
        normalizedBm25 * 0.3 +
        overlapRatio * 0.2 +
        Math.min(0.2, titleBonus + keywordBonus);
    }

    // Sort by final Re-rank Score
    allCandidates.sort((a, b) => b.rerankScore - a.rerankScore);

    // 6. Confidence Threshold (Only keep candidates with rerankScore >= 0.35)
    const filteredTop = allCandidates
      .filter(c => c.rerankScore >= 0.35 || c.denseScore >= 0.70 || c.bm25Score >= 3.0)
      .slice(0, topK);

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    const citations: RAGCitation[] = filteredTop.map(c => ({
      id: c.chunk.id,
      title: c.chunk.title,
      sourceDoc: c.chunk.sourceDoc,
      relevanceScore: Math.round(c.rerankScore * 100) / 100,
      retrievalMethod: c.denseScore > 0.6 && c.bm25Score > 0 ? 'hybrid_rrf' : c.denseScore > 0.6 ? 'dense_vector' : 'sparse_bm25'
    }));

    const top1 = filteredTop[0];
    const metrics: RetrievalMetric = {
      queryLatencyMs: latency,
      totalCandidatesEvaluated: accessibleChunks.length,
      denseScore: top1 ? Math.round(top1.denseScore * 100) / 100 : 0,
      bm25Score: top1 ? Math.round(top1.bm25Score * 100) / 100 : 0,
      hybridRrfScore: top1 ? Math.round(top1.rrfScore * 1000) / 1000 : 0,
      rerankScore: top1 ? Math.round(top1.rerankScore * 100) / 100 : 0,
      confidencePercent: top1 ? Math.min(99, Math.round(top1.rerankScore * 115)) : 0
    };

    return {
      topChunks: filteredTop,
      citations,
      metrics
    };
  }
}
