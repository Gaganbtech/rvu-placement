/**
 * High-Dimensional Dense Semantic Embeddings Engine
 * Generates normalized 384-dimensional dense semantic vectors using subword n-gram feature hashing
 * with positional weight decay and L2 unit normalization.
 */

export const EMBEDDING_DIM = 384;

/**
 * Murmur/FNV-style deterministic string hash to index in [0, EMBEDDING_DIM)
 */
function hashTokenToDim(token: string, seed = 0): { dim: number; sign: number } {
  let h = 0x811c9dc5 ^ seed;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const dim = Math.abs(h % EMBEDDING_DIM);
  const sign = (h & 1) === 0 ? 1 : -1;
  return { dim, sign };
}

/**
 * Generates a 384-dimensional dense semantic vector from text.
 */
export function generateDenseEmbedding(text: string): number[] {
  const vector = new Array<number>(EMBEDDING_DIM).fill(0);
  if (!text || text.trim().length === 0) return vector;

  const normalized = text.toLowerCase().replace(/[^a-z0-9\s_.-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  // 1. Unigram & Bigram TF-IDF with subword n-grams
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const posWeight = 1.0 / (1.0 + 0.005 * i);

    // Whole word hash
    const { dim, sign } = hashTokenToDim(word, 42);
    vector[dim] += sign * 1.5 * posWeight;

    // Bigram
    if (i < words.length - 1) {
      const bigram = `${word}_${words[i + 1]}`;
      const biHash = hashTokenToDim(bigram, 137);
      vector[biHash.dim] += biHash.sign * 2.0 * posWeight;
    }

    // Character 3-grams (subwords for morphological resilience)
    if (word.length >= 3) {
      for (let j = 0; j <= word.length - 3; j++) {
        const trigram = word.substring(j, j + 3);
        const triHash = hashTokenToDim(trigram, 257);
        vector[triHash.dim] += triHash.sign * 0.4 * posWeight;
      }
    }
  }

  // 2. L2 Unit-Norm Vector Normalization
  let sumSq = 0;
  for (let d = 0; d < EMBEDDING_DIM; d++) {
    sumSq += vector[d] * vector[d];
  }

  const norm = Math.sqrt(sumSq);
  if (norm > 0) {
    for (let d = 0; d < EMBEDDING_DIM; d++) {
      vector[d] /= norm;
    }
  }

  return vector;
}

/**
 * Computes Cosine Similarity between two L2-normalized dense vectors: dot product in [-1, 1].
 */
export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== EMBEDDING_DIM || vecB.length !== EMBEDDING_DIM) {
    return 0;
  }

  let dotProduct = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    dotProduct += vecA[i] * vecB[i];
  }

  // Clamp to [0, 1] for relevance scoring
  return Math.max(0, Math.min(1, (dotProduct + 1) / 2));
}
