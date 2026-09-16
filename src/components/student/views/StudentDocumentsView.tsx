import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Download, 
  Eye, 
  RefreshCw, 
  ShieldCheck,
  Upload,
  Trash2
} from 'lucide-react';
import type { StudentDocument, Student } from '../../../data/platform/types';
import { useStudentStore } from '../../../data/platform/studentStore';
import { Button } from '../../ui/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface StudentDocumentsViewProps {
  student: Student;
  documents: StudentDocument[];
  onUploadResume: (fileName: string, fileSize: string) => void;
}

export const StudentDocumentsView: React.FC<StudentDocumentsViewProps> = ({
  student,
  documents,
  onUploadResume
}) => {
  const store = useStudentStore();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<StudentDocument | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'RESUME' | 'CERTIFICATE' | 'TRANSCRIPT'>('ALL');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    docId: string;
    docTitle: string;
  }>({
    isOpen: false,
    docId: '',
    docTitle: ''
  });

  const activeResume = documents.find(d => d.type === 'RESUME' && d.isActiveForApplications);
  const certificates = documents.filter(d => d.type === 'CERTIFICATE');
  const transcripts = documents.filter(d => d.type === 'TRANSCRIPT');

  const filteredDocs = activeTab === 'ALL'
    ? documents
    : documents.filter(d => d.type === activeTab);

  const handleSimulatedUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      onUploadResume(`Aarav_Sharma_RVU_Tech_Resume_v4_${Date.now().toString().slice(-4)}.pdf`, '438 KB');
      setIsUploading(false);
      setNotificationMsg('New resume uploaded and designated as active for campus applications.');
      setTimeout(() => setNotificationMsg(null), 4000);
    }, 600);
  };

  const handleDeleteConfirm = () => {
    store.deleteStudentDocument(deleteConfirm.docId);
    setDeleteConfirm({ isOpen: false, docId: '', docTitle: '' });
    setNotificationMsg('Document removed from your placement vault.');
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                PLACEMENT CREDENTIALS REPOSITORY
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CAR Verified Records
              </span>
              <span className="text-[10px] font-mono text-rvu-muted bg-white/5 px-2 py-0.5 rounded border border-white/10">
                SRN: {student.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-2">
              Placement Document Vault
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Store, audit, and dispatch official placement credentials. Transcripts and verified certifications are cross-checked against university examination records.
            </p>
          </div>

          {/* Quick Upload Action */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSimulatedUpload}
            isLoading={isUploading}
            icon={<Upload className="w-4 h-4" />}
          >
            Upload New Resume
          </Button>
        </div>

        {/* Feedback Alert */}
        {notificationMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Summary Badges */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resume: <strong>Active for Drives</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Certificates: <strong>{certificates.length} Uploaded</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Transcripts: <strong>{transcripts.length} SIS Verified</strong>
          </span>
        </div>
      </div>

      {/* 1. PRIMARY RESUME CARD */}
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
                {activeResume ? activeResume.fileName : 'Aarav_Sharma_RVU_Tech_Resume_v3.2.pdf'}
              </h2>
              <div className="text-xs font-mono text-rvu-subtle">
                Last updated: <strong className="text-gold">{activeResume?.uploadedDate || '10 Sep 2026'}</strong> • Size: {activeResume?.fileSize || '412 KB'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedDocPreview(activeResume || documents[0])}
              icon={<Eye className="w-3.5 h-3.5" />}
            >
              View Document
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulatedUpload}
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
            This resume is automatically attached when you click <strong>Apply Now</strong> for campus opportunities. CAR recruiters receive this exact verified PDF.
          </p>
        </div>
      </div>

      {/* 2. ALL DOCUMENTS TABLE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-gold uppercase tracking-wider font-mono">
            Verified Documents & Certifications ({filteredDocs.length})
          </h2>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['ALL', 'RESUME', 'CERTIFICATE', 'TRANSCRIPT'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === tab
                    ? 'bg-gold text-navy-dark font-bold'
                    : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
                }`}
              >
                {tab === 'ALL' ? 'All Docs' : tab.charAt(0) + tab.slice(1).toLowerCase() + 's'}
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
                  <th className="p-4">CAR Audit Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gold shrink-0" />
                        <span>{doc.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-rvu-muted">{doc.type}</td>
                    <td className="p-4 text-rvu-subtle text-[11px]">{doc.fileName} ({doc.fileSize})</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{doc.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDocPreview(doc)}
                          className="text-xs text-gold hover:underline"
                        >
                          Preview
                        </button>
                        <span className="text-white/20">•</span>
                        <button
                          onClick={() => {
                            setNotificationMsg(`Downloading verified document: ${doc.fileName}`);
                            setTimeout(() => setNotificationMsg(null), 3000);
                          }}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Document Preview */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#131F2A] border border-gold-border rounded-2xl shadow-2xl p-6 text-rvu-text space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" />
                <h3 className="text-base font-bold text-white font-display">
                  {selectedDocPreview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="text-xs font-mono text-rvu-subtle hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 rounded-xl bg-[#0E1720] border border-white/5 text-center space-y-3">
              <div className="w-16 h-16 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-gold">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{selectedDocPreview.fileName}</div>
                <div className="text-xs text-rvu-subtle font-mono mt-1">
                  Category: {selectedDocPreview.type} • Size: {selectedDocPreview.fileSize} • Uploaded: {selectedDocPreview.uploadedDate}
                </div>
              </div>
              <div className="text-xs text-emerald-400 font-mono flex items-center justify-center gap-1 pt-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Audited & Stamped by RVU CAR Placement Cell</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
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
                  setNotificationMsg(`Document download initiated: ${selectedDocPreview.fileName}`);
                  setSelectedDocPreview(null);
                  setTimeout(() => setNotificationMsg(null), 3000);
                }}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Download Document
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
