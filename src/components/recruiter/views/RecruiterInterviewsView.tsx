import React, { useState } from 'react';
import {
  Calendar,
  PlusCircle,
  ChevronRight
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface RecruiterInterviewsViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const RecruiterInterviewsView: React.FC<RecruiterInterviewsViewProps> = ({
  store,
  onNavigate
}) => {
  const interviews = store.recruiterInterviews;
  const candidates = store.recruiterCandidates;
  const opps = store.recruiterOpportunities;
  const activeCompany = store.activeCompany;

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED'>('ALL');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New Interview Form
  const [candId, setCandId] = useState(candidates[0]?.id || '');
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundTitle, setRoundTitle] = useState('Technical Deep Dive & System Design');
  const [date, setDate] = useState('25 Sep 2026');
  const [timeSlot, setTimeSlot] = useState('02:00 PM - 03:00 PM IST');
  const [mode, setMode] = useState<'In-person' | 'Microsoft Teams' | 'Google Meet'>('Google Meet');
  const [venueOrLink, setVenueOrLink] = useState('https://meet.google.com/rvu-corporate-int');
  const [interviewerName, setInterviewerName] = useState(store.activeRecruiter?.name || 'Senior Technical Panel');

  const filtered = interviews.filter(i => statusFilter === 'ALL' || i.status === statusFilter);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = candidates.find(c => c.id === candId) || candidates[0];
    const candidateApp = store.recruiterApplications.find(a => a.studentId === candId);

    store.scheduleRecruiterInterview({
      applicationId: candidateApp?.id || `APP-${Date.now()}`,
      studentId: candidate?.id || 'RVU-PENDING',
      studentName: candidate?.name || 'RVU Candidate',
      studentEmail: candidate?.email || 'student@rvu.edu.in',
      programme: candidate?.programme || 'B.Tech (Hons.) Computer Science & Engineering',
      role: candidateApp?.role || opps[0]?.role || 'Software Engineer',
      roundNumber: Number(roundNumber),
      roundTitle,
      date,
      timeSlot,
      mode,
      venueOrLink,
      interviewerName,
      status: 'SCHEDULED'
    });

    setIsScheduleModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Interviews & Panel Evaluations
          </h1>
          <p className="text-xs text-gray-400">
            Coordinate virtual and on-campus technical & culture interview rounds for {activeCompany?.name || 'your company'}
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors self-start sm:self-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Schedule Interview Slot</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        {(['ALL', 'SCHEDULED', 'COMPLETED'] as const).map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === st
                ? 'bg-[#CCAA68] text-[#101A22] font-semibold'
                : 'bg-[#19252F] text-gray-300 hover:text-white border border-[#CCAA68]/20'
            }`}
          >
            {st} ({st === 'ALL' ? interviews.length : interviews.filter(i => i.status === st).length})
          </button>
        ))}
      </div>

      {/* Interviews List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
          <Calendar className="w-10 h-10 text-gray-500 mx-auto" />
          <div className="text-sm font-semibold text-white">No interviews found</div>
          <p className="text-xs text-gray-400">
            Schedule an interview slot to evaluate shortlisted candidates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(interview => {
            const hasEval = !!interview.evaluation;

            return (
              <div
                key={interview.id}
                className="p-5 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 hover:border-[#CCAA68]/50 transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#CCAA68]/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        Round {interview.roundNumber}: {interview.roundTitle}
                      </h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold ${
                        interview.status === 'COMPLETED'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      }`}>
                        {interview.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-300 mt-1">
                      Candidate: <strong className="text-white">{interview.studentName}</strong> ({interview.studentId}) • Role: <strong className="text-[#CCAA68]">{interview.role}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate(`/recruiter/interviews/${interview.id}`)}
                    className="px-4 py-2 rounded-lg bg-[#20303A] hover:bg-[#CCAA68] text-white hover:text-[#101A22] text-xs font-semibold border border-[#CCAA68]/20 transition-all flex items-center gap-1.5 self-start md:self-auto"
                  >
                    <span>{hasEval ? 'View Scorecard & Feedback' : 'Evaluate Candidate'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#20303A]">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Date & Time Slot</div>
                    <div className="font-semibold text-white mt-0.5">{interview.date}</div>
                    <div className="text-gray-400 text-[11px]">{interview.timeSlot}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20303A]">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Mode & Venue / Link</div>
                    <div className="font-semibold text-white mt-0.5">{interview.mode}</div>
                    <div className="text-[#CCAA68] text-[11px] font-mono truncate">{interview.venueOrLink}</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#20303A]">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Interviewer Panel</div>
                    <div className="font-semibold text-white mt-0.5">{interview.interviewerName}</div>
                    <div className="text-gray-400 text-[11px]">{activeCompany?.name}</div>
                  </div>
                </div>

                {/* Evaluation Summary if completed */}
                {interview.evaluation && (
                  <div className="p-3 rounded-lg bg-[#101A22] border border-[#CCAA68]/30 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-white font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Recommendation:</span>
                        <span className={`font-bold ${
                          interview.evaluation.recommendation.includes('HIRE') ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {interview.evaluation.recommendation.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[#CCAA68] font-bold">
                        Score: {interview.evaluation.overallScore}/10
                      </div>
                    </div>
                    <div className="text-gray-300 text-[11px] italic">
                      "{interview.evaluation.notes}"
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101A22] border border-[#CCAA68]/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#CCAA68]/20 pb-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#CCAA68]" />
                <span>Schedule Technical Interview Round</span>
              </h2>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>

            <form onSubmit={handleSchedule} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Select Candidate *</label>
                <select
                  value={candId}
                  onChange={e => setCandId(e.target.value)}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                >
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id}) - {c.programme} (CGPA: {c.cgpa})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Round Number *</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={roundNumber}
                    onChange={e => setRoundNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Interview Mode *</label>
                  <select
                    value={mode}
                    onChange={e => setMode(e.target.value as any)}
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  >
                    <option value="In-person">In-Person (RVU Campus Block 2)</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Round Title *</label>
                <input
                  type="text"
                  value={roundTitle}
                  onChange={e => setRoundTitle(e.target.value)}
                  placeholder="e.g. Systems Architecture & Live Coding"
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Date *</label>
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    placeholder="e.g. 25 Sep 2026"
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium">Time Slot *</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    placeholder="e.g. 02:00 PM - 03:00 PM IST"
                    className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Venue Location or Meeting URL *</label>
                <input
                  type="text"
                  value={venueOrLink}
                  onChange={e => setVenueOrLink(e.target.value)}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium">Interviewer Name / Title</label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={e => setInterviewerName(e.target.value)}
                  className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#CCAA68]/15">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#20303A] text-white text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#CCAA68] text-[#101A22] font-semibold text-xs hover:bg-[#D8B978]"
                >
                  Schedule & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
