/**
 * Production RAG Audit Logger & Observability Engine
 * Tracks all retrieval events, latency benchmarks, confidence distributions, and security alerts.
 */

import type { RAGAuditEntry, UserRoleContext } from './types';

const AUDIT_STORAGE_KEY = 'rvu_rag_audit_trail_v1';
const MAX_LOGS = 100;

export class RAGAuditLogger {
  private static memoryLogs: RAGAuditEntry[] = [];

  public static loadLogs(): RAGAuditEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (raw) {
        this.memoryLogs = JSON.parse(raw);
      }
    } catch {
      this.memoryLogs = [];
    }
    return this.memoryLogs;
  }

  public static logQuery(
    query: string,
    role: UserRoleContext,
    retrievedChunkIds: string[],
    confidenceScore: number,
    latencyMs: number,
    isGuardrailTriggered = false,
    guardrailReason?: string
  ): RAGAuditEntry {
    const entry: RAGAuditEntry = {
      id: `rag-log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      query,
      role,
      retrievedChunkIds,
      confidenceScore,
      latencyMs,
      isGuardrailTriggered,
      guardrailReason
    };

    this.memoryLogs = [entry, ...this.memoryLogs].slice(0, MAX_LOGS);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.memoryLogs));
      } catch (err) {
        console.error('Failed to write RAG audit log:', err);
      }
    }

    return entry;
  }

  public static getLogs(): RAGAuditEntry[] {
    if (this.memoryLogs.length === 0) {
      this.loadLogs();
    }
    return this.memoryLogs;
  }

  public static clearLogs(): void {
    this.memoryLogs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUDIT_STORAGE_KEY);
    }
  }
}
