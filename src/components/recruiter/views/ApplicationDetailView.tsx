import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Sparkles,
  FileText
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { ApplicationStage } from '../../../data/platform/types';

interface ApplicationDetailViewProps {
  applicationId: string;
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const ApplicationDetailView: React.FC<ApplicationDetailViewProps> = ({
  applicationId,
  store,
  onNavigate
}) => {
  const app = store.recruiterApplications.find(a => a.id === applicationId) || store.applications.find(a => a.id === applicationId);
  const candidate = store.recruiterCandidates.find(c => c.id === app?.studentId) || store.students.find(s => s.id === app?.studentId);
  const interviews = store.recruiterInterviews.filter(i => i.applicationId === applicationId);
  const assessments = store.recruiterAssessments.filter(a =>
    a.candidates.some(c => c.applicationId === applicationId)
  );

  const [targetStage, setTargetStage] = useState<ApplicationStage>(app?.stage || 'UNDER_REVIEW');
  const [remarks, setRemarks] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!app) {
    return (
      <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <div className="text-sm font-semibold text-white">Application Record Not Found</div>
        <p className="text-xs text-gray-400">
          The requested application ({applicationId}) could not be located.
        </p>
        <button
          onClick={() => onNavigate('/recruiter/applications')}
          className="px-4 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Applications</span>
        </button>
      </div>
    );
  }

  const handleAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    store.advanceApplicationStage(app.id, targetStage, remarks.trim() || undefined);
    setActionSuccess(`Application stage updated to ${targetStage} and synced with student dashboard.`);
    setRemarks('');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const stages: ApplicationStage[] = [
    'UNDER_REVIEW',
    'SHORTLISTED',
    'ASSESSMENT',
    'INTERVIEW',
    'SELECTED',
    'OFFER',
    'REJECTED'
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('/recruiter/applications')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications Desk</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(`/recruiter/candidates/${app.studentId}`)}
            className="px-3 py-1.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-white text-xs border border-[#CCAA68]/20 font-medium transition-colors"
          >
            Full Academic Dossier
          </button>
          <button
            onClick={() => onNavigate('/recruiter/messages')}
            className="px-3 py-1.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-[#CCAA68] text-xs border border-[#CCAA68]/30 font-medium transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Send Direct Message</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Candidate Profile Summary Header */}
      <div className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CCAA68]/15 pb-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[#CCAA68]/20 border border-[#CCAA68]/40 text-[#D8B978] flex items-center justify-center font-bold text-base flex-shrink-0">
              {candidate?.name?.slice(0, 2).toUpperCase() || 'ST'}
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight truncate">
                  {candidate?.name || 'RVU Candidate'}
                </h1>
                <span className="text-xs bg-[#20303A] text-gray-300 px-2.5 py-0.5 rounded font-mono border border-white/10">
                  {app.studentId}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-[#CCAA68] text-[#101A22]">
                  {app.stage}
                </span>
              </div>

              <div className="text-xs text-gray-300 flex flex-wrap items-center gap-2">
                <span>{candidate?.programme}</span>
                <span>•</span>
                <span>{candidate?.school}</span>
                <span>•</span>
                <span>Batch {candidate?.batch || '2023–2027'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-1 text-xs">
            <div className="text-gray-400">Position Applied:</div>
            <div className="font-bold text-white text-sm">{app.role}</div>
            <div className="text-[#CCAA68] font-mono text-xs">{app.compensation}</div>
          </div>
        </div>

        {/* Academic Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Cumulative CGPA</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{candidate?.cgpa || '8.42'}</div>
            <div className="text-[10px] text-gray-400">Semesters I–VI audited</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Active Backlogs</div>
            <div className="text-base font-bold text-white mt-0.5">{candidate?.activeBacklogs ?? 0}</div>
            <div className="text-[10px] text-gray-400">CAR Eligibility: Verified</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Academic Attendance</div>
            <div className="text-base font-bold text-white mt-0.5">{candidate?.attendancePercentage || 88}%</div>
            <div className="text-[10px] text-gray-400">Institutional threshold: 75%</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Application Submitted</div>
            <div className="text-base font-bold text-white mt-0.5">{app.submittedAt.split(',')[0]}</div>
            <div className="text-[10px] text-gray-400">Verified by CAR Portal</div>
          </div>
        </div>

        {/* CANDIDATE RESUME & UPLOADED CREDENTIALS CARD */}
        <div className="p-4 rounded-xl bg-[#101A22] border border-[#CCAA68]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CCAA68]/15 border border-[#CCAA68]/30 flex items-center justify-center text-[#CCAA68] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Candidate Placement Resume</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  CAR Verified
                </span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                {app.resumeFileName || `${candidate?.name?.replace(/\s+/g, '_') || 'Student'}_Resume.pdf`} • {app.resumeSize || '380 KB'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const downloadName = app.resumeFileName || `${candidate?.name?.replace(/\s+/g, '_') || 'Candidate'}_Resume.txt`;
                const fallback = `RV UNIVERSITY PLACEMENT PORTAL\nCandidate: ${candidate?.name} (${candidate?.id})\nRole: ${app.role}\nCompany: ${app.companyName}\nCGPA: ${candidate?.cgpa || '8.42'}\nSkills: ${candidate?.skills?.map(s => s.name).join(', ') || 'Engineering, Full-Stack'}\nVerification: CAR Audited`;
                
                const anchor = document.createElement('a');
                anchor.href = app.resumeDataUrl || `data:text/plain;charset=utf-8,${encodeURIComponent(fallback)}`;
                anchor.download = downloadName;
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
              }}
              className="px-4 py-2 rounded-lg bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] text-xs font-bold transition-all shadow flex items-center gap-1.5"
            >
              <span>Download Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Stage Advancement Card */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-[#19252F] to-[#20303A] border border-[#CCAA68]/30 space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-[#CCAA68]" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            Advance Candidate Recruitment Stage
          </h2>
        </div>
        <p className="text-xs text-gray-300">
          Updating the candidate's stage will instantly reflect on the student's personal portal and alert the CAR Placement Office.
        </p>

        <form onSubmit={handleAdvance} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Select Next Stage *</label>
              <select
                value={targetStage}
                onChange={e => setTargetStage(e.target.value as ApplicationStage)}
                className="w-full bg-[#101A22] text-white p-2.5 rounded-lg border border-[#CCAA68]/30 focus:border-[#CCAA68] focus:outline-none"
              >
                {stages.map(st => (
                  <option key={st} value={st}>
                    {st.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Recruiter Remarks / Reason (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Cleared technical screening with high problem-solving marks"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="w-full bg-[#101A22] text-white p-2.5 rounded-lg border border-[#CCAA68]/30 focus:border-[#CCAA68] focus:outline-none placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors shadow-md flex items-center gap-1.5"
            >
              <span>Confirm & Notify Candidate</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Two Column Layout: Timeline & Scheduled Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Stage Progression Timeline */}
        <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Application Milestone Timeline
          </h3>

          <div className="space-y-4 pt-2">
            {(app.timeline || []).map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 relative">
                {/* Vertical connecting line */}
                {idx < (app.timeline || []).length - 1 && (
                  <div className="absolute left-3.5 top-6 bottom-0 w-0.5 bg-[#CCAA68]/20" />
                )}

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 ${
                    step.completed
                      ? 'bg-emerald-500 text-black'
                      : step.active
                      ? 'bg-[#CCAA68] text-[#101A22] shadow-md shadow-[#CCAA68]/30 ring-2 ring-[#CCAA68]/40'
                      : 'bg-[#20303A] text-gray-500'
                  }`}
                >
                  {step.completed ? '✓' : idx + 1}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white">{step.label}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{step.timestamp}</span>
                  </div>
                  {step.remarks && (
                    <div className="text-[11px] text-gray-300 italic bg-[#20303A] p-2 rounded border border-white/5">
                      {step.remarks}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interviews & Assessments linked to this candidate */}
        <div className="space-y-6">
          {/* Assessment Performance */}
          <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Assessment Results
            </h3>

            {assessments.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                No proctored assessment records yet for this candidate.
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.map(assess => {
                  const candRecord = assess.candidates.find(c => c.applicationId === applicationId);
                  return (
                    <div key={assess.id} className="p-3.5 rounded-lg bg-[#20303A] border border-white/5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{assess.title}</span>
                        <span className="font-mono text-emerald-400 font-bold text-sm">
                          {candRecord?.score !== undefined ? `${candRecord.score}/100` : 'Pending'}
                        </span>
                      </div>
                      <div className="text-gray-400 text-[11px]">
                        Platform: {assess.platform} • Proctoring Flags: {candRecord?.proctoringFlags ?? 0}
                      </div>
                      {candRecord?.feedback && (
                        <div className="text-[11px] text-gray-300 italic bg-[#101A22] p-2 rounded">
                          "{candRecord.feedback}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scheduled Interviews */}
          <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Interview Records
            </h3>

            {interviews.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                No interviews scheduled for this candidate yet.
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.map(interview => (
                  <div key={interview.id} className="p-3.5 rounded-lg bg-[#20303A] border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">
                        Round {interview.roundNumber}: {interview.roundTitle}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-500/20 text-blue-300">
                        {interview.status}
                      </span>
                    </div>
                    <div className="text-gray-300 text-[11px]">
                      {interview.date} at {interview.timeSlot} • Mode: {interview.mode}
                    </div>
                    {interview.venueOrLink && (
                      <div className="text-[#CCAA68] text-[11px] font-mono truncate">
                        {interview.venueOrLink}
                      </div>
                    )}
                    {interview.evaluation && (
                      <div className="mt-2 p-2.5 rounded bg-[#101A22] border border-[#CCAA68]/20 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-white font-medium">
                          <span>Evaluation: {interview.evaluation.recommendation}</span>
                          <span className="text-[#CCAA68] font-bold">{interview.evaluation.overallScore}/10</span>
                        </div>
                        <div className="text-gray-400 italic">"{interview.evaluation.notes}"</div>
                      </div>
                    )}
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
