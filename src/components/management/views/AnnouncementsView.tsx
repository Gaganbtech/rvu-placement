import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Send,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import { OFFICIAL_RVU_SCHOOLS } from '../../../data/platform/demoData';

interface AnnouncementsViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  store
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    targetAudience: 'ALL_STUDENTS' as 'ALL_STUDENTS' | 'SCHOOL_SPECIFIC' | 'ELIGIBLE_ONLY',
    targetSchool: OFFICIAL_RVU_SCHOOLS[0],
    urgency: 'NORMAL' as 'NORMAL' | 'URGENT' | 'MANDATORY',
    category: 'PLACEMENT_DRIVE'
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;

    store.publishAnnouncement({
      title: newAnnouncement.title.trim(),
      content: newAnnouncement.content.trim(),
      targetAudience: newAnnouncement.targetAudience,
      targetSchool: newAnnouncement.targetAudience === 'SCHOOL_SPECIFIC' ? newAnnouncement.targetSchool : undefined,
      urgency: newAnnouncement.urgency,
      category: newAnnouncement.category,
      author: 'Office of Corporate & Alumni Relations (CAR)'
    });

    setShowModal(false);
    setNewAnnouncement({
      title: '',
      content: '',
      targetAudience: 'ALL_STUDENTS',
      targetSchool: OFFICIAL_RVU_SCHOOLS[0],
      urgency: 'NORMAL',
      category: 'PLACEMENT_DRIVE'
    });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              INSTITUTIONAL BROADCAST ENGINE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              Auto-dispatches to Student Portals
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Placement Announcements & Circulars
          </h1>
          <p className="text-xs text-rvu-muted">
            Broadcast official circulars, drive advisories, and policy notices. Directly notifies students in real time.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gold text-navy-dark hover:bg-gold-light text-xs font-bold shadow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Circular / Broadcast</span>
        </button>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-3">
        {store.announcements.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 font-bold">
                    {item.category}
                  </span>
                  {item.isMandatory && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      MANDATORY ATTENDANCE
                    </span>
                  )}
                  {item.priority === 'URGENT' && !item.isMandatory && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      URGENT NOTICE
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-rvu-subtle">
                    Target: <strong className="text-white">{item.targetAudience || 'ALL'}</strong>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-display">
                  {item.title}
                </h3>
              </div>

              <div className="text-[10px] font-mono text-rvu-subtle shrink-0">
                {item.publishedDate}
              </div>
            </div>

            <p className="text-xs text-rvu-text leading-relaxed whitespace-pre-wrap">
              {item.content}
            </p>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-rvu-subtle">
              <span>Author: {item.publishedBy}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Dispatched to Student Feeds
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#111C26] border border-gold-border/60 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-gold" />
                <h3 className="text-base font-bold text-white font-display">
                  Publish Institutional Circular
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-rvu-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3 text-xs">
              <div>
                <label className="block text-rvu-muted mb-1">Circular Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Briefing: Cisco Systems Campus Drive Logistics"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-rvu-muted mb-1">Category</label>
                  <select
                    value={newAnnouncement.category}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="PLACEMENT_DRIVE">Placement Drive Advisory</option>
                    <option value="POLICY_UPDATE">Placement Policy Update</option>
                    <option value="WORKSHOP">Career Training / Workshop</option>
                    <option value="GENERAL">General Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-rvu-muted mb-1">Urgency Level</label>
                  <select
                    value={newAnnouncement.urgency}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, urgency: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="NORMAL">Standard Notice</option>
                    <option value="URGENT">Urgent Action Required</option>
                    <option value="MANDATORY">Mandatory Attendance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">Target Cohort Audience</label>
                <select
                  value={newAnnouncement.targetAudience}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetAudience: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                >
                  <option value="ALL_STUDENTS">All Registered Students</option>
                  <option value="ELIGIBLE_ONLY">Eligible Students Only (AY 2026–27)</option>
                  <option value="SCHOOL_SPECIFIC">Specific School Only</option>
                </select>
              </div>

              {newAnnouncement.targetAudience === 'SCHOOL_SPECIFIC' && (
                <div>
                  <label className="block text-rvu-muted mb-1">Select Target School</label>
                  <select
                    value={newAnnouncement.targetSchool}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetSchool: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  >
                    {OFFICIAL_RVU_SCHOOLS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-rvu-muted mb-1">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed notice, instructions, dress code, venue, and reporting guidelines..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-rvu-subtle font-mono">
                  Will instantly notify target students.
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-gold text-navy-dark font-bold text-xs hover:bg-gold-light flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast Now</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
