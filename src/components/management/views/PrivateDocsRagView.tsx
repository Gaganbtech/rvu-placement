import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  Lock,
  Globe,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Send,
  Bot
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import {
  getPrivateKnowledgeDocs,
  ingestPrivateDocument,
  removePrivateKnowledgeDoc,
  queryPlacementRAG,
  type PrivateKnowledgeDoc,
  type RAGResponse
} from '../../../services/placementRagEngine';

interface PrivateDocsRagViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const PrivateDocsRagView: React.FC<PrivateDocsRagViewProps> = () => {
  const [docs, setDocs] = useState<PrivateKnowledgeDoc[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Form states
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'policy' | 'recruiter' | 'management' | 'preparation' | 'tiers' | 'general'>('policy');
  const [visibility, setVisibility] = useState<'confidential_placement_cell' | 'all_roles'>('confidential_placement_cell');
  const [rawTextInput, setRawTextInput] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState(0);

  // Live Test Sandbox
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState<RAGResponse | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setDocs(getPrivateKnowledgeDocs());
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setSelectedFileSize(file.size);
    if (!docTitle) {
      setDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawTextInput(content || `[Document content of ${file.name}]`);
    };

    if (file.name.endsWith('.txt') || file.name.endsWith('.json') || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      // For simulated binary docs (.pdf, .docx, .xlsx), create structured indexed representation
      setRawTextInput(`Official Institutional Document: ${file.name}\nCategory: ${docCategory}\nVisibility: ${visibility}\n\nKey Directives:\n1. All recruitment activities and offer letters are governed under RV University Placement Cell guidelines.\n2. Ingested for automated RAG answer retrieval.`);
    }
  };

  const handleIngest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawTextInput.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      const fileName = selectedFileName || `${docTitle || 'Private_Doc'}.txt`;
      const newDoc = ingestPrivateDocument(
        fileName,
        rawTextInput,
        fileName.split('.').pop() || 'txt',
        selectedFileSize || rawTextInput.length,
        visibility,
        docTitle,
        docCategory
      );

      setDocs(getPrivateKnowledgeDocs());
      setIsUploading(false);
      setUploadSuccess(`Successfully ingested "${newDoc.title}" (${newDoc.chunksCount} RAG chunks indexed)`);

      // Reset form
      setDocTitle('');
      setRawTextInput('');
      setSelectedFileName('');
      setSelectedFileSize(0);

      setTimeout(() => setUploadSuccess(null), 4000);
    }, 600);
  };

  const handleDelete = (docId: string) => {
    removePrivateKnowledgeDoc(docId);
    setDocs(getPrivateKnowledgeDocs());
  };

  const handleRunTestQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    setIsTesting(true);
    setTimeout(() => {
      const res = queryPlacementRAG(testQuery, 'management');
      setTestResult(res);
      setIsTesting(false);
    }, 400);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 font-display">
            <Sparkles className="w-6 h-6 text-[#CCAA68]" />
            <span>Placement Cell Private Document RAG Ingestion</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Upload confidential circulars, salary agreements, and placement policy documents to enhance the Placement AI Assistant
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-xs text-[#CCAA68] bg-[#CCAA68]/15 px-3 py-1.5 rounded-lg border border-[#CCAA68]/30 font-mono">
            {docs.length} Private Docs Ingested
          </div>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Grid: Upload & Form (Left) + Live RAG Sandbox (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upload Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#19252F] border border-[#CCAA68]/30 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#CCAA68]" />
              <span>Ingest New Private Knowledge Document</span>
            </h2>
            <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">
              Auto Chunking
            </span>
          </div>

          <form onSubmit={handleIngest} className="space-y-4">
            
            {/* File Drag / Select Box */}
            <div className="border-2 border-dashed border-[#CCAA68]/40 hover:border-[#CCAA68] rounded-xl p-5 text-center bg-[#101A22]/50 transition-colors">
              <input
                type="file"
                id="doc-file-upload"
                onChange={handleFileSelect}
                accept=".pdf,.docx,.txt,.csv,.json,.xlsx"
                className="hidden"
              />
              <label htmlFor="doc-file-upload" className="cursor-pointer space-y-2 block">
                <FileText className="w-8 h-8 text-[#CCAA68] mx-auto opacity-80" />
                <div className="text-xs font-semibold text-white">
                  {selectedFileName ? (
                    <span className="text-emerald-400 font-mono">{selectedFileName}</span>
                  ) : (
                    <span>Click to browse or drag PDF, DOCX, TXT, CSV, JSON</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400">
                  Document will be automatically tokenized and indexed into the RAG vector store.
                </p>
              </label>
            </div>

            {/* Document Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-gray-300 mb-1">
                  Document Title:
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. AY 2026 Drive Guidelines & Penalties"
                  className="w-full bg-[#101A22] text-white text-xs px-3 py-2 rounded-lg border border-white/10 focus:border-[#CCAA68] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-300 mb-1">
                  Category:
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full bg-[#101A22] text-white text-xs px-3 py-2 rounded-lg border border-white/10 focus:border-[#CCAA68] focus:outline-none"
                >
                  <option value="policy">Placement Regulations & Policy</option>
                  <option value="tiers">Salary Tiers & Packages</option>
                  <option value="recruiter">Recruiter Guidelines & Slots</option>
                  <option value="management">Institutional Management & NIRF</option>
                  <option value="preparation">Interview Prep & ATS Standards</option>
                </select>
              </div>
            </div>

            {/* Visibility & Confidentiality Setting */}
            <div>
              <label className="block text-[11px] font-mono text-gray-300 mb-1.5">
                RAG Access & Confidentiality Level:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                    visibility === 'confidential_placement_cell'
                      ? 'bg-rose-950/30 border-rose-500/50 text-white'
                      : 'bg-[#101A22] border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'confidential_placement_cell'}
                    onChange={() => setVisibility('confidential_placement_cell')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5 text-rose-300">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Confidential (Placement Cell Only)</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                      Hidden from students and public. Accessible only when logged in as Placement Cell.
                    </div>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                    visibility === 'all_roles'
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                      : 'bg-[#101A22] border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'all_roles'}
                    onChange={() => setVisibility('all_roles')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5 text-emerald-300">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Published Policy (All Roles)</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                      Searchable by students, recruiters, and the public chatbot assistant.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Raw Text Excerpt / Direct Editor */}
            <div>
              <label className="block text-[11px] font-mono text-gray-300 mb-1">
                Document Content / Text to Ingest:
              </label>
              <textarea
                value={rawTextInput}
                onChange={(e) => setRawTextInput(e.target.value)}
                placeholder="Paste document text or let the file reader extract content automatically..."
                rows={5}
                className="w-full bg-[#101A22] text-white text-xs p-3 rounded-lg border border-white/10 focus:border-[#CCAA68] focus:outline-none font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isUploading || !rawTextInput.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] disabled:opacity-50 text-[#101A22] font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#101A22] border-t-transparent rounded-full animate-spin" />
                  <span>Tokenizing & Ingesting Chunks...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ingest & Index into RAG Engine</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live RAG Test Sandbox (5 cols) */}
        <div className="lg:col-span-5 bg-[#19252F] border border-[#CCAA68]/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Live RAG Validation Sandbox</span>
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Placement Cell Lens
              </span>
            </div>

            <p className="text-xs text-gray-400 mb-3">
              Test queries against your newly uploaded private documents and verify grounded citations in real time.
            </p>

            <form onSubmit={handleRunTestQuery} className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="e.g. What are the penalty rules for missed interviews?"
                className="flex-1 bg-[#101A22] text-white text-xs px-3 py-2 rounded-xl border border-white/10 focus:border-[#CCAA68] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!testQuery.trim() || isTesting}
                className="p-2 rounded-xl bg-[#CCAA68] text-[#101A22] hover:bg-[#D8B978] disabled:opacity-40 transition-colors"
                title="Run RAG Query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Test Result Area */}
            {testResult && (
              <div className="p-3.5 rounded-xl bg-[#101A22] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#CCAA68] font-bold">RAG Response:</span>
                  {testResult.isGuardrailTriggered && (
                    <span className="text-[9px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-500/30">
                      Guardrail Active
                    </span>
                  )}
                </div>

                <div className="text-gray-200 whitespace-pre-line text-xs leading-relaxed">
                  {testResult.answer}
                </div>

                {testResult.citations.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#CCAA68]" />
                      <span>Retrieved Citations:</span>
                    </div>
                    {testResult.citations.map((c) => (
                      <div key={c.id} className="text-[10px] text-[#CCAA68] bg-black/40 px-2 py-0.5 rounded font-mono truncate">
                        • {c.title} ({c.sourceDoc})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick preset tests */}
          <div className="pt-3 border-t border-white/10">
            <div className="text-[10px] font-mono text-gray-400 mb-1.5">Quick Test Scenarios:</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Which companies are recruiting?',
                'Recruiter HR contact phone number',
                'What are the RVU salary tiers?'
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTestQuery(query);
                    const res = queryPlacementRAG(query, 'management');
                    setTestResult(res);
                  }}
                  className="text-[10px] bg-[#101A22] text-gray-300 hover:text-white px-2 py-0.5 rounded border border-white/10 hover:border-[#CCAA68]/40 font-mono transition-colors text-left"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Active Private Documents Table */}
      <div className="bg-[#19252F] border border-[#CCAA68]/30 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#CCAA68]" />
              <span>Active Ingested Private Knowledge Documents</span>
            </h2>
            <p className="text-xs text-gray-400">
              Documents currently participating in real-time RAG context retrieval
            </p>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            Total {docs.length} Active Documents
          </div>
        </div>

        {docs.length === 0 ? (
          <div className="p-8 text-center bg-[#101A22]/40 rounded-xl border border-dashed border-white/10 space-y-2">
            <FileText className="w-8 h-8 text-gray-500 mx-auto" />
            <div className="text-xs font-semibold text-white">No private documents uploaded yet</div>
            <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
              Upload your first placement policy document or internal guideline using the form above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Document Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Visibility</th>
                  <th className="py-2.5 px-3">Chunks</th>
                  <th className="py-2.5 px-3">Uploaded At</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {docs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{doc.title}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{doc.fileName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10 uppercase">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {doc.visibility === 'confidential_placement_cell' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/40">
                          <Lock className="w-3 h-3" />
                          <span>Confidential</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                          <Globe className="w-3 h-3" />
                          <span>Published</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-300">
                      {doc.chunksCount} chunks
                    </td>
                    <td className="py-3 px-3 text-gray-400 font-mono text-[11px]">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-900/40 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Production RAG Health & Engine Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#142330] border border-[#CCAA68]/30 space-y-1">
          <div className="text-[10px] font-mono text-gray-400 uppercase">Dense Embedding Model</div>
          <div className="text-base font-bold text-white font-mono">384-Dim Vectors</div>
          <div className="text-[10px] text-emerald-400">Cosine Distance Unit Norm</div>
        </div>

        <div className="p-4 rounded-xl bg-[#142330] border border-[#CCAA68]/30 space-y-1">
          <div className="text-[10px] font-mono text-gray-400 uppercase">Lexical Search Engine</div>
          <div className="text-base font-bold text-white font-mono">Okapi BM25</div>
          <div className="text-[10px] text-sky-400">k1=1.2, b=0.75 IDF Smoothing</div>
        </div>

        <div className="p-4 rounded-xl bg-[#142330] border border-[#CCAA68]/30 space-y-1">
          <div className="text-[10px] font-mono text-gray-400 uppercase">Rank Fusion Algorithm</div>
          <div className="text-base font-bold text-white font-mono">RRF (k=60)</div>
          <div className="text-[10px] text-[#CCAA68]">Cross-Encoder Re-ranking</div>
        </div>

        <div className="p-4 rounded-xl bg-[#142330] border border-[#CCAA68]/30 space-y-1">
          <div className="text-[10px] font-mono text-gray-400 uppercase">Security & Privacy Filter</div>
          <div className="text-base font-bold text-emerald-400 font-mono">Active (RBAC)</div>
          <div className="text-[10px] text-gray-400">Zero Recruiter Leak / Anti-Injection</div>
        </div>
      </div>

    </div>
  );
};
