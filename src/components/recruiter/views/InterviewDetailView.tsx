import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface InterviewDetailViewProps {
  interviewId: string;
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const InterviewDetailView: React.FC<InterviewDetailViewProps> = ({
  interviewId,
  store,
  onNavigate
}) => {
  const interview = store.recruiterInterviews.find(i => i.id === interviewId);
  const candidate = store.recruiterCandidates.find(c => c.id === interview?.studentId);
  const activeRecruiter = store.activeRecruiter;

  const existingEval = interview?.evaluation;

  // Evaluation Form State
  const [techScore, setTechScore] = useState<number>(existingEval?.technicalScore || 8);
  const [commScore, setCommScore] = useState<number>(existingEval?.communicationScore || 8);
  const [probScore, setProbScore] = useState<number>(existingEval?.problemSolvingScore || 9);
  const [recommendation, setRecommendation] = useState<'STRONG_HIRE' | 'HIRE' | 'HOLD' | 'REJECT'>(
    existingEval?.recommendation || 'STRONG_HIRE'
  );
  const [notes, setNotes] = useState<string>(
    existingEval?.notes || 'Solid grasp of core systems and distributed architectures. Articulated trade-offs with clarity.'
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!interview) {
    return (
      <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <div className="text-sm font-semibold text-white">Interview Record Not Found</div>
        <button
          onClick={() => onNavigate('/recruiter/interviews')}
          className="px-4 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Interviews</span>
        </button>
      </div>
    );
  }

  const computedOverall = parseFloat(((techScore + commScore + probScore) / 3).toFixed(1));

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    store.evaluateInterview(interview.id, {
      technicalScore: techScore,
      communicationScore: commScore,
      problemSolvingScore: probScore,
      overallScore: computedOverall,
      recommendation,
      notes,
      submittedAt: 'Today',
      evaluatorName: activeRecruiter?.name || 'Recruitment Lead'
    });

    setSuccessMsg('Interview scorecard & hire recommendation recorded successfully!');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('/recruiter/interviews')}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interviews</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(`/recruiter/candidates/${interview.studentId}`)}
            className="px-3 py-1.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-white text-xs border border-[#CCAA68]/20 font-medium transition-colors"
          >
            Candidate Dossier
          </button>
          <button
            onClick={() => onNavigate('/recruiter/offers')}
            className="px-4 py-1.5 rounded-lg bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] text-xs font-semibold transition-colors"
          >
            Extend Offer
          </button>
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
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Round {interview.roundNumber}: {interview.roundTitle}
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-blue-500/20 text-blue-300">
                {interview.status}
              </span>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              Candidate: <strong className="text-white">{interview.studentName}</strong> ({interview.studentId}) • Role: <strong className="text-[#CCAA68]">{interview.role}</strong>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400">Scheduled Date & Time</div>
            <div className="text-sm font-bold text-white">{interview.date} • {interview.timeSlot}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Mode & Venue</div>
            <div className="font-semibold text-white mt-0.5">{interview.mode}</div>
            <div className="text-[#CCAA68] font-mono text-[11px] truncate">{interview.venueOrLink}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Academic Standing</div>
            <div className="font-semibold text-emerald-400 mt-0.5">{candidate?.cgpa || '8.42'} CGPA</div>
            <div className="text-gray-400 text-[11px]">{candidate?.programme || 'B.Tech CSE'}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#20303A]">
            <div className="text-[10px] text-gray-400 uppercase font-mono">Assigned Interviewer</div>
            <div className="font-semibold text-white mt-0.5">{interview.interviewerName}</div>
            <div className="text-gray-400 text-[11px]">{interview.companyName}</div>
          </div>
        </div>
      </div>

      {/* Evaluation Scorecard Form */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-[#19252F] to-[#20303A] border border-[#CCAA68]/30 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#CCAA68]/20 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#CCAA68]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Technical Scorecard & Hiring Recommendation
            </h2>
          </div>
          <div className="text-xs text-[#CCAA68] font-mono font-bold">
            Overall Score: {computedOverall} / 10
          </div>
        </div>

        <form onSubmit={handleSaveEvaluation} className="space-y-5 text-xs">
          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-lg bg-[#101A22] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Technical Competency</span>
                <span className="font-mono text-[#CCAA68] font-bold text-sm">{techScore} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={techScore}
                onChange={e => setTechScore(parseInt(e.target.value))}
                className="w-full accent-[#CCAA68]"
              />
              <div className="text-[10px] text-gray-400">Coding, algorithmic logic, and architecture</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#101A22] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Communication & Articulation</span>
                <span className="font-mono text-[#CCAA68] font-bold text-sm">{commScore} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={commScore}
                onChange={e => setCommScore(parseInt(e.target.value))}
                className="w-full accent-[#CCAA68]"
              />
              <div className="text-[10px] text-gray-400">Clarity of explanation and teamwork</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#101A22] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Problem Solving & Analytical</span>
                <span className="font-mono text-[#CCAA68] font-bold text-sm">{probScore} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={probScore}
                onChange={e => setProbScore(parseInt(e.target.value))}
                className="w-full accent-[#CCAA68]"
              />
              <div className="text-[10px] text-gray-400">Approach to edge cases and optimization</div>
            </div>
          </div>

          {/* Recommendation Selection */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-medium">Hiring Recommendation *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['STRONG_HIRE', 'HIRE', 'HOLD', 'REJECT'] as const).map(rec => (
                <button
                  key={rec}
                  type="button"
                  onClick={() => setRecommendation(rec)}
                  className={`p-2.5 rounded-lg text-xs font-bold transition-all text-center ${
                    recommendation === rec
                      ? rec.includes('HIRE')
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-amber-500 text-black shadow-md'
                      : 'bg-[#101A22] text-gray-300 border border-white/10 hover:bg-white/5'
                  }`}
                >
                  {rec.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Qualitative Notes */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-medium">Interviewer Feedback Notes *</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Provide detailed feedback on candidate's technical responses, systems design trade-offs, and general conduct..."
              className="w-full bg-[#101A22] text-white p-3 rounded-lg border border-[#CCAA68]/20 focus:border-[#CCAA68] focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-bold text-xs transition-colors shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Final Evaluation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
