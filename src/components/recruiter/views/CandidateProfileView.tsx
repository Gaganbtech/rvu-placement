import React from 'react';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface CandidateProfileViewProps {
  candidateId: string;
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({
  candidateId,
  store,
  onNavigate
}) => {
  const candidate = store.recruiterCandidates.find(c => c.id === candidateId) || store.students.find(s => s.id === candidateId);
  const apps = store.recruiterApplications.filter(a => a.studentId === candidateId);
  const documents = store.documents.filter(d => d.studentId === candidateId);
  const interviews = store.recruiterInterviews.filter(i => i.studentId === candidateId);

  if (!candidate) {
    return (
      <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <div className="text-sm font-semibold text-white">Candidate Record Not Found</div>
        <p className="text-xs text-gray-400">
          The requested student ({candidateId}) is not currently in your company's pipeline.
        </p>
        <button
          onClick={() => onNavigate('/recruiter/candidates')}
          className="px-4 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Candidate Directory</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('/recruiter/candidates')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/recruiter/messages')}
            className="px-3 py-1.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-[#CCAA68] text-xs border border-[#CCAA68]/30 font-medium transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Send Direct Message</span>
          </button>
          {apps.length > 0 && (
            <button
              onClick={() => onNavigate(`/recruiter/applications/${apps[0].id}`)}
              className="px-4 py-1.5 rounded-lg bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] text-xs font-semibold transition-colors"
            >
              Advance Application Stage
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CCAA68]/15 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#CCAA68]/20 border border-[#CCAA68]/40 text-[#D8B978] flex items-center justify-center font-bold text-xl flex-shrink-0">
              {candidate.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {candidate.name}
                </h1>
                <span className="text-xs bg-[#20303A] text-gray-300 px-2.5 py-0.5 rounded font-mono border border-white/10">
                  {candidate.id}
                </span>
                <span className="text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>CAR Audited</span>
                </span>
              </div>

              <div className="text-xs text-gray-300">
                {candidate.programme} • {candidate.school}
              </div>
              {candidate.specialization && (
                <div className="text-xs text-[#CCAA68] font-medium">
                  Specialization: {candidate.specialization}
                </div>
              )}
            </div>
          </div>

          <div className="text-right flex flex-col items-start md:items-end gap-1">
            <div className="text-2xl font-bold text-emerald-400">{candidate.cgpa} CGPA</div>
            <div className="text-xs text-gray-400">0 Active Backlogs • 88% Attendance</div>
          </div>
        </div>

        {/* Academic Profile Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Academic Cohort</div>
            <div className="font-bold text-white text-sm mt-0.5">Batch {candidate.batch}</div>
            <div className="text-[10px] text-gray-400">Class of {candidate.graduationYear}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Current Semester</div>
            <div className="font-bold text-white text-sm mt-0.5">Semester {candidate.semester}</div>
            <div className="text-[10px] text-gray-400">{candidate.academicYear}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Institutional Email</div>
            <div className="font-medium text-white text-xs mt-0.5 truncate">{candidate.email}</div>
            <div className="text-[10px] text-gray-400">Official RVU domain</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">University Reg. No</div>
            <div className="font-bold text-white text-sm mt-0.5 font-mono">{candidate.universityRegisterNumber}</div>
            <div className="text-[10px] text-gray-400">SIS verified</div>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Applications & Verified Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applications with this company */}
          <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Active Job Applications ({apps.length})
            </h3>

            {apps.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                No active applications for this candidate.
              </div>
            ) : (
              <div className="space-y-3">
                {apps.map(app => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-[#20303A] border border-white/5 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-sm">{app.role}</div>
                        <div className="text-gray-400 text-[11px]">{app.type} • {app.compensation}</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#CCAA68] text-[#101A22]">
                        {app.stage}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-gray-400 text-[11px]">Applied: {app.submittedAt}</span>
                      <button
                        onClick={() => onNavigate(`/recruiter/applications/${app.id}`)}
                        className="text-xs text-[#CCAA68] hover:underline font-medium flex items-center gap-1"
                      >
                        <span>Open Application Desk</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Documents */}
          <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Verified Placement Documents ({documents.length})
            </h3>

            {documents.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                No documents uploaded yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg bg-[#20303A] border border-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-[#CCAA68] flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">{doc.title}</div>
                        <div className="text-gray-400 text-[11px]">{doc.fileName} ({doc.fileSize})</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono">
                        {doc.status}
                      </span>
                      <button
                        onClick={() => {
                          const fallback = `RV UNIVERSITY OFFICIAL CANDIDATE DOSSIER\nCandidate: ${candidate.name} (${candidate.id})\nProgramme: ${candidate.programme}\nDocument: ${doc.title}\nStatus: Verified by CAR`;
                          const anchor = document.createElement('a');
                          anchor.href = doc.fileDataUrl || `data:text/plain;charset=utf-8,${encodeURIComponent(fallback)}`;
                          anchor.download = doc.fileName;
                          document.body.appendChild(anchor);
                          anchor.click();
                          document.body.removeChild(anchor);
                        }}
                        className="text-xs text-[#CCAA68] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Interview Schedules */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Recruiter Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('/recruiter/assessments')}
                className="w-full text-left p-2.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-white border border-white/10 font-medium transition-colors"
              >
                Schedule Proctored Assessment
              </button>
              <button
                onClick={() => onNavigate('/recruiter/interviews')}
                className="w-full text-left p-2.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-white border border-white/10 font-medium transition-colors"
              >
                Schedule Technical Interview Round
              </button>
              <button
                onClick={() => onNavigate('/recruiter/offers')}
                className="w-full text-left p-2.5 rounded-lg bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold transition-colors"
              >
                Issue Formal Placement Offer
              </button>
            </div>
          </div>

          {/* Past / Scheduled Interviews */}
          <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Interviews Scheduled
            </h3>
            {interviews.length === 0 ? (
              <div className="text-gray-400 py-3 text-center">No interviews scheduled yet.</div>
            ) : (
              <div className="space-y-2">
                {interviews.map(i => (
                  <div key={i.id} className="p-2.5 rounded bg-[#20303A] border border-white/5 space-y-1">
                    <div className="font-semibold text-white">Round {i.roundNumber}: {i.roundTitle}</div>
                    <div className="text-gray-400 text-[11px]">{i.date} • {i.timeSlot}</div>
                    <div className="text-[10px] text-[#CCAA68] font-mono">{i.status}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
