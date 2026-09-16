/**
 * Production-Grade RAG Architecture Type Definitions
 */

export type UserRoleContext = 'student' | 'recruiter' | 'management' | 'public';

export type KnowledgeCategory =
  | 'policy'
  | 'recruiter'
  | 'management'
  | 'preparation'
  | 'tiers'
  | 'general'
  | 'private_doc';

export interface KnowledgeChunk {
  id: string;
  docId: string;
  category: KnowledgeCategory;
  targetRoles: UserRoleContext[];
  title: string;
  sourceDoc: string;
  keywords: string[];
  content: string;
  tokenCount: number;
  embedding?: number[]; // 384-dim dense vector
  isConfidential?: boolean;
  metadata?: {
    uploadedBy?: string;
    uploadedAt?: string;
    sectionIndex?: number;
    parentDocHash?: string;
  };
}

export interface PrivateKnowledgeDoc {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  visibility: 'confidential_placement_cell' | 'all_roles';
  title: string;
  category: KnowledgeCategory;
  extractedText: string;
  chunksCount: number;
  totalTokens: number;
}

export interface RAGCitation {
  id: string;
  title: string;
  sourceDoc: string;
  relevanceScore: number;
  retrievalMethod: 'hybrid_rrf' | 'dense_vector' | 'sparse_bm25';
}

export interface RetrievalMetric {
  queryLatencyMs: number;
  totalCandidatesEvaluated: number;
  denseScore: number;
  bm25Score: number;
  hybridRrfScore: number;
  rerankScore: number;
  confidencePercent: number;
}

export interface RAGAuditEntry {
  id: string;
  timestamp: string;
  query: string;
  role: UserRoleContext;
  retrievedChunkIds: string[];
  confidenceScore: number;
  latencyMs: number;
  isGuardrailTriggered: boolean;
  guardrailReason?: string;
}

export interface RAGResponse {
  answer: string;
  citations: RAGCitation[];
  suggestedFollowups: string[];
  isGuardrailTriggered: boolean;
  roleContext: UserRoleContext;
  metrics: RetrievalMetric;
  provider: 'gemini-flash' | 'local-grounded-engine';
}
