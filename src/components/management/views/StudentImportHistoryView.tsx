import React, { useState } from 'react';
import {
  History,
  FileSpreadsheet,
  CheckCircle2,
  Upload,
  Eye,
  Download,
  XCircle,
  X
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { StudentImportRecord } from '../../../data/platform/types';
import { generateExcelTemplate } from '../../../utils/excelImport';

interface StudentImportHistoryViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const StudentImportHistoryView: React.FC<StudentImportHistoryViewProps> = ({
  store,
  onNavigate
}) => {
  const [selectedBatch, setSelectedBatch] = useState<StudentImportRecord | null>(null);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              INGESTION AUDIT LOG
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              {store.importHistory.length} Batches Processed
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Student Data Import History
          </h1>
          <p className="text-xs text-rvu-muted">
            Track batch ingestion logs, validation reports, error diagnostic files, and historical commits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => generateExcelTemplate()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-card hover:bg-white/10 text-white text-xs font-medium border border-gold-border/40 transition-colors"
          >
            <Download className="w-4 h-4 text-gold" />
            <span>Template</span>
          </button>
          
          <button
            onClick={() => onNavigate('/management/students/import')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gold text-navy-dark hover:bg-gold-light text-xs font-bold shadow transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>New Import</span>
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 overflow-hidden shadow-lg">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0D161E] border-b border-gold-border/30 text-rvu-subtle font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3">Batch ID</th>
                <th className="p-3">Spreadsheet File</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3 text-center">Total</th>
                <th className="p-3 text-center">Successful</th>
                <th className="p-3 text-center">Failed</th>
                <th className="p-3">Imported By</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {store.importHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-rvu-muted">
                    <History className="w-8 h-8 text-rvu-subtle mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-white">No historical import batches found.</p>
                  </td>
                </tr>
              ) : (
                store.importHistory.map((batch) => (
                  <tr key={batch.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-gold">
                      {batch.id}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-sky-400 shrink-0" />
                        <span className="font-sans text-white truncate max-w-[200px]" title={batch.fileName}>
                          {batch.fileName}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-rvu-subtle">
                      {batch.timestamp}
                    </td>

                    <td className="p-3 text-center text-white font-bold">
                      {batch.totalRows}
                    </td>

                    <td className="p-3 text-center text-emerald-400 font-bold">
                      {batch.addedCount + batch.updatedCount}
                    </td>

                    <td className="p-3 text-center">
                      <span className={batch.errorCount > 0 ? 'text-rose-400 font-bold' : 'text-rvu-subtle'}>
                        {batch.errorCount}
                      </span>
                    </td>

                    <td className="p-3 font-sans text-rvu-muted truncate max-w-[160px]">
                      {batch.uploadedBy}
                    </td>

                    <td className="p-3 text-center">
                      {batch.status === 'COMPLETED' ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          COMPLETED
                        </span>
                      ) : batch.status === 'COMPLETED_WITH_WARNINGS' ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          WITH WARNINGS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          FAILED
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedBatch(batch)}
                        className="px-2.5 py-1 rounded-lg bg-navy-card hover:bg-gold/20 text-rvu-muted hover:text-gold border border-gold-border/30 transition-colors inline-flex items-center gap-1 font-sans text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Log</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Diagnostics Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#111C26] border border-gold-border/60 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-gold" />
                <h3 className="text-base font-bold text-white font-display">
                  Batch Diagnostics: {selectedBatch.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="p-1 rounded-lg text-rvu-muted hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-[#142330] border border-gold-border/30">
                <span className="text-rvu-subtle text-[10px] block">TOTAL</span>
                <span className="text-base font-bold text-white">{selectedBatch.totalRows}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#142330] border border-gold-border/30">
                <span className="text-rvu-subtle text-[10px] block">SUCCESS</span>
                <span className="text-base font-bold text-emerald-400">{selectedBatch.addedCount + selectedBatch.updatedCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#142330] border border-gold-border/30">
                <span className="text-rvu-subtle text-[10px] block">NEW / UPDATED</span>
                <span className="text-base font-bold text-sky-400">
                  {selectedBatch.addedCount} / {selectedBatch.updatedCount}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#142330] border border-gold-border/30">
                <span className="text-rvu-subtle text-[10px] block">FAILED / ERRORS</span>
                <span className="text-base font-bold text-rose-400">{selectedBatch.errorCount}</span>
              </div>
            </div>

            {/* Error Rows Listing */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-rvu-subtle mb-2">
                Failed / Flagged Entries ({selectedBatch.errorDetails ? selectedBatch.errorDetails.length : 0})
              </h4>
              {(!selectedBatch.errorDetails || selectedBatch.errorDetails.length === 0) ? (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No rejected rows recorded for this batch. All entries passed validation.</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {selectedBatch.errorDetails.map((err, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-rose-300 font-bold">Row #{err.rowNumber}</span>
                        <span className="text-[10px] text-rvu-subtle">ID: {err.studentId || 'N/A'}</span>
                      </div>
                      <div className="text-white text-[11px] font-sans">
                        Field: {err.field} &bull; {err.studentName || 'Unspecified'}
                      </div>
                      <div className="text-rose-400 text-[11px] flex items-center gap-1 font-mono">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{err.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedBatch(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
