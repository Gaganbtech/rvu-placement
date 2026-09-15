import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface AssessmentResultsViewProps {
  assessmentId: string;
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const AssessmentResultsView: React.FC<AssessmentResultsViewProps> = ({
  assessmentId,
  store,
  onNavigate
}) => {
  const assess = store.recruiterAssessments.find(a => a.id === assessmentId);

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!assess) {
    return (
      <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <div className="text-sm font-semibold text-white">Assessment Session Not Found</div>
        <button
          onClick={() => onNavigate('/recruiter/assessments')}
          className="px-4 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Assessments</span>
        </button>
      </div>
    );
  }

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId) return;

    store.evaluateAssessmentCandidate(assess.id, selectedCandidateId, scoreInput, feedbackInput);
    setSuccessMsg('Candidate evaluation and feedback recorded successfully.');
    setSelectedCandidateId(null);
    setFeedbackInput('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('/recruiter/assessments')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assessments List</span>
        </button>

        <div className="text-xs text-[#CCAA68] bg-[#CCAA68]/15 px-3 py-1.5 rounded-lg border border-[#CCAA68]/30 font-mono">
          Passing Threshold: {assess.passingMarks} / {assess.totalMarks}
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#CCAA68]/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{assess.title}</h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400">
                {assess.status}
              </span>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              Role: <strong className="text-white">{assess.role}</strong> • Platform: <strong className="text-[#CCAA68]">{assess.platform}</strong>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400">Duration & Questions</div>
            <div className="text-sm font-bold text-white">{assess.durationMinutes} mins • {assess.questionsCount} items</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Candidates Enrolled</div>
            <div className="text-lg font-bold text-white mt-0.5">{assess.candidates.length}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Completed Tests</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              {assess.candidates.filter(c => c.status === 'EVALUATED').length}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Pending Submissions</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">
              {assess.candidates.filter(c => c.status === 'PENDING').length}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Proctoring Status</div>
            <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full Tab Audit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Enrolled Candidates & Evaluation Scores
        </h3>

        <div className="space-y-3">
          {assess.candidates.map(cand => {
            const hasScore = cand.score !== undefined;
            const isPassed = hasScore && (cand.score ?? 0) >= (assess.passingMarks || 70);

            return (
              <div
                key={cand.studentId}
                className="p-4 rounded-xl bg-[#20303A] border border-white/5 space-y-3 text-xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{cand.studentName}</span>
                      <span className="text-[10px] bg-[#101A22] text-gray-300 px-2 py-0.5 rounded font-mono">
                        {cand.studentId}
                      </span>
                      <span className="text-gray-400 text-[11px]">• CGPA: <strong className="text-emerald-400">{cand.cgpa}</strong></span>
                    </div>
                    <div className="text-gray-400 text-[11px] mt-0.5">{cand.programme}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400">Score Achieved</div>
                      <div className={`text-base font-bold font-mono ${
                        hasScore
                          ? isPassed ? 'text-emerald-400' : 'text-rose-400'
                          : 'text-gray-400'
                      }`}>
                        {hasScore ? `${cand.score} / ${assess.totalMarks}` : 'Pending Test'}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCandidateId(cand.studentId);
                        setScoreInput(cand.score || 85);
                        setFeedbackInput(cand.feedback || '');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors"
                    >
                      {hasScore ? 'Update Score' : 'Score Candidate'}
                    </button>

                    {isPassed && (
                      <button
                        onClick={() => {
                          store.advanceApplicationStage(cand.applicationId, 'INTERVIEW', 'Cleared online assessment with passing score');
                          setSuccessMsg(`${cand.studentName} advanced to INTERVIEW stage!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 font-medium"
                      >
                        To Interview
                      </button>
                    )}
                  </div>
                </div>

                {cand.feedback && (
                  <div className="p-2.5 rounded-lg bg-[#101A22] border border-[#CCAA68]/20 text-[11px] space-y-1">
                    <div className="text-gray-400">
                      Evaluated by <strong className="text-white">{cand.evaluatedBy || 'Recruitment Lead'}</strong>
                    </div>
                    <div className="text-gray-300 italic">"{cand.feedback}"</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal to Score Candidate */}
      {selectedCandidateId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101A22] border border-[#CCAA68]/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#CCAA68]/20 pb-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Record Assessment Score & Feedback
              </h2>
              <button onClick={() => setSelectedCandidateId(null)} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Candidate Score (0 - 100) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scoreInput}
                  onChange={e => setScoreInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Evaluator Feedback Notes *</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Solid algorithmic clarity. Completed all unit test assertions."
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#CCAA68]/15">
                <button
                  type="button"
                  onClick={() => setSelectedCandidateId(null)}
                  className="px-4 py-2 rounded-lg bg-[#20303A] text-white text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs hover:bg-[#D8B978]"
                >
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
