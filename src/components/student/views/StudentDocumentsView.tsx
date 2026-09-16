import React, { useState, useRef } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Download, 
  Eye, 
  RefreshCw, 
  ShieldCheck,
  Upload,
  Trash2,
  AlertCircle
} from 'lucide-react';
import type { StudentDocument, Student } from '../../../data/platform/types';
import { useStudentStore } from '../../../data/platform/studentStore';
import { Button } from '../../ui/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { readFileAsDataUrl, formatFileSize, triggerFileDownload } from '../../../utils/fileStorage';

interface StudentDocumentsViewProps {
  student: Student;
  documents: StudentDocument[];
  onUploadResume: (fileName: string, fileSize: string) => void;
}

export const StudentDocumentsView: React.FC<StudentDocumentsViewProps> = ({
  student,
  documents
}) => {
  const store = useStudentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<'RESUME' | 'CERTIFICATE' | 'TRANSCRIPT' | 'PORTFOLIO'>('RESUME');
  const [selectedDocPreview, setSelectedDocPreview] = useState<StudentDocument | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'RESUME' | 'CERTIFICATE' | 'TRANSCRIPT' | 'PORTFOLIO'>('ALL');
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    docId: string;
    docTitle: string;
  }>({
    isOpen: false,
    docId: '',
    docTitle: ''
  });

  const activeResume = documents.find(d => d.type === 'RESUME' && d.isActiveForApplications) || documents.find(d => d.type === 'RESUME');
  const certificates = documents.filter(d => d.type === 'CERTIFICATE');
  const transcripts = documents.filter(d => d.type === 'TRANSCRIPT');

  const filteredDocs = activeTab === 'ALL'
    ? documents
    : documents.filter(d => d.type === activeTab);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const sizeFormatted = formatFileSize(file.size);
      
      const docType = uploadCategory;
      const title = docType === 'RESUME' 
        ? `Placement Resume (${file.name.replace(/\.[^/.]+$/, '')})`
        : docType === 'CERTIFICATE'
        ? `Verified Certificate (${file.name.replace(/\.[^/.]+$/, '')})`
        : `Placement Document (${file.name})`;

      store.uploadDocument(
        docType,
        title,
        file.name,
        sizeFormatted,
        dataUrl
      );

      setNotificationMsg({
        type: 'success',
        text: `Successfully uploaded ${file.name} to your Placement Vault.`
      });
      setTimeout(() => setNotificationMsg(null), 4000);
    } catch (err) {
      console.error('File upload error:', err);
      setNotificationMsg({
        type: 'error',
        text: 'Failed to process document. Please try a valid PDF or Word document.'
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteConfirm = () => {
    store.deleteStudentDocument(deleteConfirm.docId);
    setDeleteConfirm({ isOpen: false, docId: '', docTitle: '' });
    setNotificationMsg({ type: 'success', text: 'Document removed from your placement vault.' });
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleDownload = (doc: StudentDocument) => {
    triggerFileDownload(
      doc.fileName,
      doc.fileDataUrl,
      `RV UNIVERSITY PLACEMENT DOCUMENT\nTitle: ${doc.title}\nStudent: ${student.name} (${student.id})\nProgramme: ${student.programme}\nStatus: Verified`
    );
    setNotificationMsg({ type: 'success', text: `Downloaded ${doc.fileName}` });
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleSetActiveResume = (docId: string) => {
    // Update active flag
    store.uploadResume(
      documents.find(d => d.id === docId)?.fileName || 'resume.pdf',
      documents.find(d => d.id === docId)?.fileSize || '350 KB',
      documents.find(d => d.id === docId)?.fileDataUrl
    );
    setNotificationMsg({ type: 'success', text: 'Designated as primary resume for all campus job applications.' });
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                PLACEMENT CREDENTIALS REPOSITORY
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CAR Verified Vault
              </span>
              <span className="text-[10px] font-mono text-rvu-muted bg-white/5 px-2 py-0.5 rounded border border-white/10">
                SRN: {student.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-2">
              Placement Document Vault
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Upload your official resume, certifications, and transcripts. Active resumes are automatically attached when you apply for campus opportunities.
            </p>
          </div>

          {/* Quick Upload Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setUploadCategory('RESUME');
                fileInputRef.current?.click();
              }}
              isLoading={isUploading}
              icon={<Upload className="w-4 h-4" />}
            >
              Upload Resume (PDF/DOC)
            </Button>
          </div>
        </div>

        {/* Feedback Alert */}
        {notificationMsg && (
          <div className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 animate-fadeIn ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}>
            {notificationMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notificationMsg.text}</span>
          </div>
        )}

        {/* Summary Badges */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resume: <strong>Active for Campus Drives</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Certificates: <strong>{certificates.length} Uploaded</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Transcripts: <strong>{transcripts.length} CAR Verified</strong>
          </span>
        </div>
      </div>

      {/* DRAG & DROP UPLOAD ZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center space-y-4 ${
          isDragging
            ? 'border-gold bg-gold/10 scale-[1.01]'
            : 'border-gold-border/40 bg-navy-card/60 hover:border-gold-border'
        }`}
      >
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
          <Upload className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            Drag and drop your file here, or browse from your device
          </h3>
          <p className="text-xs text-rvu-muted mt-1">
            Supports PDF, DOCX, DOC, JPG, and PNG (Max 15MB)
          </p>
        </div>

        {/* Category Selector for upload */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-rvu-subtle font-mono mr-2">Upload As:</span>
          {(['RESUME', 'CERTIFICATE', 'PORTFOLIO'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setUploadCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                uploadCategory === cat
                  ? 'bg-gold text-navy-dark font-bold'
                  : 'bg-white/5 text-rvu-muted hover:text-white border border-white/10'
              }`}
            >
              {cat === 'RESUME' ? '📄 Resume' : cat === 'CERTIFICATE' ? '🏆 Certificate' : '💼 Portfolio'}
            </button>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy-dark font-bold text-xs transition-all shadow-gold-glow"
          >
            {isUploading ? 'Reading File...' : 'Choose File to Upload'}
          </button>
        </div>
      </div>

      {/* 1. PRIMARY ACTIVE RESUME CARD */}
      <div className="p-6 sm:p-8 rounded-2xl bg-navy-card border border-gold-border/60 space-y-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold/15 border-2 border-gold/40 flex items-center justify-center text-gold shadow-gold-glow shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase font-mono">
                  Primary Placement Resume
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  ✓ Active for Drives
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-display mt-0.5">
                {activeResume ? activeResume.fileName : 'Aarav_Sharma_RVU_Tech_Resume_v4.pdf'}
              </h2>
              <div className="text-xs font-mono text-rvu-subtle">
                Last updated: <strong className="text-gold">{activeResume?.uploadedDate || '16 Sep 2026'}</strong> • Size: {activeResume?.fileSize || '380 KB'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeResume && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedDocPreview(activeResume)}
                icon={<Eye className="w-3.5 h-3.5" />}
              >
                Preview
              </Button>
            )}
            {activeResume && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDownload(activeResume)}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Download
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setUploadCategory('RESUME');
                fileInputRef.current?.click();
              }}
              isLoading={isUploading}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Replace Resume
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0E1720] border border-white/5 text-xs text-rvu-muted flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            This resume is automatically delivered to verified enterprise recruiters when you submit applications. You can preview and download it at any time.
          </p>
        </div>
      </div>

      {/* 2. ALL DOCUMENTS REPOSITORY */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-gold uppercase tracking-wider font-mono">
            Uploaded Placement Records ({filteredDocs.length})
          </h2>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['ALL', 'RESUME', 'CERTIFICATE', 'TRANSCRIPT', 'PORTFOLIO'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === tab
                    ? 'bg-gold text-navy-dark font-bold'
                    : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
                }`}
              >
                {tab === 'ALL' ? 'All Files' : tab.charAt(0) + tab.slice(1).toLowerCase() + 's'}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-navy-card border border-gold-border/40 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E1720] border-b border-gold-border/30 text-rvu-subtle font-mono text-[11px] uppercase">
                <tr>
                  <th className="p-4">Document Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">File Name & Size</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-rvu-muted">
                      No documents found in this category. Use the uploader above to add files.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-white font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gold shrink-0" />
                          <div>
                            <div>{doc.title}</div>
                            {doc.isActiveForApplications && (
                              <span className="text-[10px] text-emerald-400 font-bold">
                                ★ Primary Campus Resume
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-rvu-muted">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[10px]">
                          {doc.type}
                        </span>
                      </td>
                      <td className="p-4 text-rvu-subtle text-[11px]">{doc.fileName} ({doc.fileSize})</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{doc.status}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {doc.type === 'RESUME' && !doc.isActiveForApplications && (
                            <>
                              <button
                                onClick={() => handleSetActiveResume(doc.id)}
                                className="text-xs text-gold hover:underline font-semibold"
                              >
                                Set Primary
                              </button>
                              <span className="text-white/20">•</span>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedDocPreview(doc)}
                            className="text-xs text-gold hover:underline"
                          >
                            Preview
                          </button>
                          <span className="text-white/20">•</span>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="text-xs text-rvu-muted hover:text-white"
                          >
                            Download
                          </button>
                          {doc.type !== 'TRANSCRIPT' && (
                            <>
                              <span className="text-white/20">•</span>
                              <button
                                onClick={() => setDeleteConfirm({
                                  isOpen: true,
                                  docId: doc.id,
                                  docTitle: doc.title
                                })}
                                className="text-xs text-rose-400 hover:text-rose-300"
                                title="Delete document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Document Preview */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#131F2A] border border-gold-border rounded-2xl shadow-2xl p-6 text-rvu-text space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" />
                <h3 className="text-base font-bold text-white font-display truncate max-w-md">
                  {selectedDocPreview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="text-sm font-mono text-rvu-subtle hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1">
              <div className="p-4 rounded-xl bg-[#0E1720] border border-white/5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-white">{selectedDocPreview.fileName}</div>
                  <div className="text-xs text-rvu-subtle font-mono mt-0.5">
                    Category: {selectedDocPreview.type} • Size: {selectedDocPreview.fileSize} • Uploaded: {selectedDocPreview.uploadedDate}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{selectedDocPreview.status}</span>
                </span>
              </div>

              {/* Document Preview Content */}
              {selectedDocPreview.fileDataUrl && selectedDocPreview.fileDataUrl.startsWith('data:image/') ? (
                <div className="rounded-xl overflow-hidden border border-white/10 text-center bg-black/40 p-2">
                  <img
                    src={selectedDocPreview.fileDataUrl}
                    alt={selectedDocPreview.fileName}
                    className="max-h-[350px] mx-auto object-contain rounded"
                  />
                </div>
              ) : selectedDocPreview.fileDataUrl && selectedDocPreview.fileDataUrl.startsWith('data:application/pdf') ? (
                <div className="rounded-xl overflow-hidden border border-white/10 h-[380px] bg-white">
                  <iframe
                    src={selectedDocPreview.fileDataUrl}
                    title={selectedDocPreview.fileName}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-[#0E1720] border border-white/5 text-left font-mono text-xs text-gray-300 space-y-3 leading-relaxed whitespace-pre-wrap">
                  <div className="text-gold font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-white/10">
                    Document Metadata & Verified Credentials
                  </div>
                  <div><strong>Student Name:</strong> {student.name}</div>
                  <div><strong>University ID:</strong> {student.id}</div>
                  <div><strong>Programme:</strong> {student.programme}</div>
                  <div><strong>School:</strong> {student.school}</div>
                  <div><strong>Cumulative CGPA:</strong> {student.cgpa} / 10.0</div>
                  <div><strong>Verified Skills:</strong> {student.skills?.map(s => s.name).join(', ') || 'Full-Stack Development, Problem Solving'}</div>
                  <div className="pt-2 text-emerald-400 text-[11px]">
                    ✓ Authenticated by RV University Office of Corporate & Alumni Relations (CAR)
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedDocPreview(null)}
              >
                Close Preview
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleDownload(selectedDocPreview);
                  setSelectedDocPreview(null);
                }}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Download File
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Placement Document?"
        message={`Are you sure you want to delete "${deleteConfirm.docTitle}" from your placement document vault? You can re-upload an updated version at any time.`}
        confirmText="Delete Document"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, docId: '', docTitle: '' })}
      />

    </div>
  );
};
