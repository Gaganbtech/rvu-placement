import React, { useState } from 'react';
import {
  Code2,
  PlusCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface AssessmentsListViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const AssessmentsListView: React.FC<AssessmentsListViewProps> = ({
  store,
  onNavigate
}) => {
  const assessments = store.recruiterAssessments;
  const opps = store.recruiterOpportunities;
  const activeCompany = store.activeCompany;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState(opps[0]?.role || 'Software Engineer Intern');
  const [newPlatform, setNewPlatform] = useState('HackerRank Proctored');
  const [newDuration, setNewDuration] = useState(90);
  const [newPassingMarks, setNewPassingMarks] = useState(75);

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    store.scheduleRecruiterAssessment({
      opportunityId: opps[0]?.id || 'OPP-2026-001',
      title: newTitle.trim(),
      role: newRole,
      platform: newPlatform,
      durationMinutes: Number(newDuration),
      totalMarks: 100,
      passingMarks: Number(newPassingMarks),
      startDate: '22 Sep 2026, 10:00 AM',
      endDate: '23 Sep 2026, 11:59 PM',
      instructions: [
        'Webcam monitoring active throughout the duration of the test.',
        'External window or tab switches trigger automatic security flags.'
      ],
      questionsCount: 15,
      status: 'ACTIVE',
      candidates: store.recruiterApplications
        .filter(a => a.stage === 'SHORTLISTED' || a.stage === 'ASSESSMENT')
        .map(a => {
          const cand = store.recruiterCandidates.find(c => c.id === a.studentId);
          return {
            applicationId: a.id,
            studentId: a.studentId,
            studentName: cand?.name || 'RVU Student',
            studentEmail: cand?.email || `${a.studentId}@rvu.edu.in`,
            programme: cand?.programme || 'B.Tech CSE',
            cgpa: cand?.cgpa || 8.42,
            status: 'PENDING' as const
          };
        })
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Online Technical Assessments
          </h1>
          <p className="text-xs text-gray-400">
            Configure proctored coding, algorithmic, and aptitude tests for {activeCompany?.name || 'your company'}
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors self-start sm:self-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Assessment Session</span>
        </button>
      </div>

      {/* Assessments Cards */}
      {assessments.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
          <Code2 className="w-10 h-10 text-gray-500 mx-auto" />
          <div className="text-sm font-semibold text-white">No active assessments</div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Schedule a coding challenge on HackerRank, Mettle, or Codility to test shortlisted RVU candidates.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Schedule Assessment</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assessments.map(assess => {
            const evaluatedCount = assess.candidates.filter(c => c.status === 'EVALUATED').length;
            const avgScore = evaluatedCount > 0
              ? Math.round(assess.candidates.reduce((acc, c) => acc + (c.score || 0), 0) / evaluatedCount)
              : null;

            return (
              <div
                key={assess.id}
                className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#CCAA68]/10 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{assess.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                        assess.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/15 text-blue-400'
                      }`}>
                        {assess.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300">
                      Target Role: <strong className="text-white">{assess.role}</strong> • Platform: <strong className="text-[#CCAA68]">{assess.platform}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate(`/recruiter/assessments/${assess.id}`)}
                    className="px-4 py-2 rounded-lg bg-[#20303A] hover:bg-[#CCAA68] text-white hover:text-[#101A22] text-xs font-semibold border border-[#CCAA68]/20 transition-all flex items-center gap-1.5 self-start md:self-auto"
                  >
                    <span>View Candidates & Scores</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#20303A]">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Duration</div>
                    <div className="font-bold text-white text-xs mt-0.5">{assess.durationMinutes} Minutes</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20303A]">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Candidates Enrolled</div>
                    <div className="font-bold text-white text-xs mt-0.5">{assess.candidates.length} Students</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20303A]">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Passing Marks</div>
                    <div className="font-bold text-emerald-400 text-xs mt-0.5">{assess.passingMarks} / {assess.totalMarks}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20303A]">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Submissions Evaluated</div>
                    <div className="font-bold text-[#CCAA68] text-xs mt-0.5">
                      {evaluatedCount} of {assess.candidates.length} {avgScore ? `(Avg: ${avgScore})` : ''}
                    </div>
                  </div>
                </div>

                {/* Window & Instructions */}
                <div className="text-xs text-gray-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div>
                    Assessment Window: <span className="text-white">{assess.startDate} to {assess.endDate}</span>
                  </div>
                  <div className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>AI & Tab Switch Proctoring Enabled</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating New Assessment */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101A22] border border-[#CCAA68]/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#CCAA68]/20 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#CCAA68]" />
                <span>Schedule New Assessment Session</span>
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Assessment Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Core Algorithms & Systems Diagnostic"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Target Role *</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="w-full bg-[#20303A] text-white p-2 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                >
                  {opps.map(o => (
                    <option key={o.id} value={o.role}>{o.role} ({o.id})</option>
                  ))}
                  <option value="General Technical Assessment">General Technical Assessment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Platform *</label>
                  <select
                    value={newPlatform}
                    onChange={e => setNewPlatform(e.target.value)}
                    className="w-full bg-[#20303A] text-white p-2 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  >
                    <option value="HackerRank Proctored">HackerRank Proctored</option>
                    <option value="Mettle Online Assessment">Mettle Online Assessment</option>
                    <option value="Codility Proctored">Codility Proctored</option>
                    <option value="In-House RVU Lab Test">In-House RVU Lab Test</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Duration (Mins) *</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={e => setNewDuration(parseInt(e.target.value) || 60)}
                    min="30"
                    max="180"
                    className="w-full bg-[#20303A] text-white p-2 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Passing Marks (out of 100) *</label>
                <input
                  type="number"
                  value={newPassingMarks}
                  onChange={e => setNewPassingMarks(parseInt(e.target.value) || 70)}
                  min="40"
                  max="100"
                  className="w-full bg-[#20303A] text-white p-2 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#20303A] border border-[#CCAA68]/15 text-[11px] text-gray-300">
                Candidates currently in <strong>SHORTLISTED</strong> or <strong>ASSESSMENT</strong> stage for this company will automatically receive notifications and portal invitations.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#CCAA68]/15">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#20303A] text-white text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs hover:bg-[#D8B978]"
                >
                  Publish Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
