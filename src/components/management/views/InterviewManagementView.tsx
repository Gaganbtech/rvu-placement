import React, { useState } from 'react';
import {
  Building2,
  Clock,
  Video,
  Plus,
  Search,
  X
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { InterviewScheduleItem } from '../../../data/platform/types';

interface InterviewManagementViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const InterviewManagementView: React.FC<InterviewManagementViewProps> = ({
  store
}) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New Interview
  const [newInterview, setNewInterview] = useState({
    studentName: store.students[0]?.name || '',
    studentId: store.students[0]?.id || '',
    companyName: 'Cisco Systems',
    roundTitle: 'Technical Round 1 (System Design & DSA)',
    date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    timeSlot: '11:00 AM - 12:00 PM',
    interviewerName: 'Arun Kumar (Staff Architect)',
    venueOrLink: 'https://rvu.webex.com/join/car-interview-room-1'
  });

  const filteredInterviews = store.interviews.filter(item => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.studentName.toLowerCase().includes(q);
      const matchComp = item.companyName.toLowerCase().includes(q);
      const matchRound = item.roundTitle.toLowerCase().includes(q);
      if (!matchName && !matchComp && !matchRound) return false;
    }
    return true;
  });

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const st = store.students.find(s => s.id === newInterview.studentId);
    const item: InterviewScheduleItem = {
      id: `int_${Date.now()}`,
      applicationId: `app_${Date.now()}`,
      studentId: newInterview.studentId,
      studentName: newInterview.studentName,
      studentEmail: st?.email || `${newInterview.studentId.toLowerCase()}@rvu.edu.in`,
      programme: st?.programme || 'B.Tech CSE',
      companyName: newInterview.companyName,
      role: 'Software Development Engineer',
      roundNumber: 1,
      roundTitle: newInterview.roundTitle,
      date: newInterview.date,
      timeSlot: newInterview.timeSlot,
      mode: newInterview.venueOrLink.startsWith('http') ? 'Microsoft Teams' : 'In-person',
      venueOrLink: newInterview.venueOrLink,
      interviewerName: newInterview.interviewerName,
      status: 'SCHEDULED'
    };

    store.scheduleInterview(item);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              ASSESSMENT & EVALUATION
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              {store.interviews.length} Scheduled Sessions
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Interview Coordination Desk
          </h1>
          <p className="text-xs text-rvu-muted">
            Coordinate virtual interview rooms, video bridge links, panel allocations, and candidate attendance logs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-navy-dark font-bold text-xs flex items-center gap-1.5 transition-all shadow-gold-glow shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-xl bg-[#111C26] border border-gold-border/40 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rvu-subtle" />
          <input
            type="text"
            placeholder="Search candidate, company, round..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white placeholder-rvu-subtle focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-rvu-subtle">
            {store.interviews.filter(i => i.status === 'SCHEDULED').length} Upcoming Rounds
          </span>
        </div>
      </div>

      {/* Interviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInterviews.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 hover:border-gold/60 transition-all flex flex-col justify-between space-y-3 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gold font-bold">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{item.companyName}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-0.5">{item.studentName}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {item.status}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#142330] border border-white/5 space-y-2 text-xs">
                <div className="font-medium text-rvu-text">{item.roundTitle}</div>
                <div className="flex items-center gap-2 text-rvu-muted font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>{item.date} &bull; {item.timeSlot}</span>
                </div>
                {item.interviewerName && (
                  <div className="text-[11px] text-rvu-subtle truncate">
                    Panel: {item.interviewerName}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              {item.venueOrLink.startsWith('http') ? (
                <a
                  href={item.venueOrLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors"
                >
                  <Video className="w-3 h-3 text-sky-400" />
                  <span>Join Room</span>
                </a>
              ) : (
                <span className="text-[11px] font-mono text-rvu-subtle truncate">{item.venueOrLink || 'On-Campus Room'}</span>
              )}

              <span className="text-[10px] font-mono text-rvu-subtle">
                Round {item.roundNumber}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Interview Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#111C26] border border-gold-border/60 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                Schedule Candidate Interview Session
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-rvu-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block text-rvu-muted mb-1">Select Candidate *</label>
                <select
                  value={newInterview.studentId}
                  onChange={(e) => {
                    const st = store.students.find(s => s.id === e.target.value);
                    if (st) {
                      setNewInterview({ ...newInterview, studentId: st.id, studentName: st.name });
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                >
                  {store.students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.universityRegisterNumber || s.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Company *</label>
                <input
                  type="text"
                  required
                  value={newInterview.companyName}
                  onChange={(e) => setNewInterview({ ...newInterview, companyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Round Title</label>
                <input
                  type="text"
                  value={newInterview.roundTitle}
                  onChange={(e) => setNewInterview({ ...newInterview, roundTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-rvu-muted mb-1">Date</label>
                  <input
                    type="date"
                    value={newInterview.date}
                    onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-rvu-muted mb-1">Time Window</label>
                  <input
                    type="text"
                    value={newInterview.timeSlot}
                    onChange={(e) => setNewInterview({ ...newInterview, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Panel Members / Interviewers</label>
                <input
                  type="text"
                  value={newInterview.interviewerName}
                  onChange={(e) => setNewInterview({ ...newInterview, interviewerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Meeting Link or Room Venue</label>
                <input
                  type="text"
                  value={newInterview.venueOrLink}
                  onChange={(e) => setNewInterview({ ...newInterview, venueOrLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gold text-navy-dark font-bold text-xs hover:bg-gold-light"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
