import React, { useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Award,
  Sparkles,
  History,
  CheckCircle2,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { PlacementStatus } from '../../../data/platform/types';

interface StudentDetail360ViewProps {
  studentId: string;
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const StudentDetail360View: React.FC<StudentDetail360ViewProps> = ({
  studentId,
  store,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'APPLICATIONS' | 'DRIVES' | 'OFFERS' | 'DOCUMENTS' | 'TIMELINE'>('OVERVIEW');
  const [editingEligibility, setEditingEligibility] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PlacementStatus>('ELIGIBLE');

  const student = store.students.find(s => s.id === studentId);

  if (!student) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Student Not Found</h2>
        <p className="text-xs text-rvu-muted">No student matching ID "{studentId}" was located in the SIS database.</p>
        <button
          onClick={() => onNavigate('/management/students')}
          className="px-4 py-2 rounded-lg bg-gold text-navy-dark text-xs font-bold"
        >
          Return to Student Master
        </button>
      </div>
    );
  }

  // Cross-reference data
  const studentApplications = store.applications.filter(a => a.studentId === student.id);
  const studentOffers = store.offers.filter(o => o.studentId === student.id);
  const studentInterviews = store.interviews.filter(i => i.studentId === student.id);
  const studentTickets = store.tickets.filter(t => t.studentId === student.id);
  const studentDocuments = store.documents.filter(d => d.studentId === student.id);
  const studentAuditLogs = store.auditLogs.filter(
    l => l.entityId === student.id || l.details.includes(student.name) || l.details.includes(student.id)
  );

  const handleUpdateStatus = () => {
    store.updateStudent(student.id, { placementStatus: selectedStatus });
    setEditingEligibility(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Back Button */}
      <button
        onClick={() => onNavigate('/management/students')}
        className="inline-flex items-center gap-2 text-xs font-mono text-rvu-muted hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Master</span>
      </button>

      {/* Student 360 Header Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#142330] via-[#101A22] to-[#142330] border border-gold-border/60 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/50 flex items-center justify-center text-gold font-serif font-bold text-2xl shadow-gold-glow shrink-0">
              {student.name.charAt(0)}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white font-display">
                  {student.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-gold/20 text-gold border border-gold/40">
                  {student.placementStatus}
                </span>
                {student.isDeactivated && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    DEACTIVATED
                  </span>
                )}
              </div>

              <div className="text-xs text-rvu-muted flex items-center gap-2 flex-wrap">
                <span className="font-mono text-white">USN: {student.universityRegisterNumber || student.id}</span>
                <span>&bull;</span>
                <span>{student.programme}</span>
                <span>&bull;</span>
                <span className="text-gold-light">{student.school}</span>
              </div>

              <div className="text-[11px] font-mono text-rvu-subtle flex items-center gap-3 pt-1">
                <span>Email: <strong className="text-white">{student.email}</strong></span>
                {student.phone && <span>Phone: <strong className="text-white">{student.phone}</strong></span>}
                <span>Batch: <strong className="text-white">{student.batch || '2023–2027'}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div className="text-center px-3">
              <div className="text-[10px] font-mono text-rvu-subtle uppercase">CGPA</div>
              <div className="text-2xl font-bold font-mono text-white">{student.cgpa.toFixed(2)}</div>
              <div className={`text-[10px] font-mono ${student.activeBacklogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {student.activeBacklogs} Backlogs
              </div>
            </div>

            <div className="text-center px-3 border-l border-white/10">
              <div className="text-[10px] font-mono text-rvu-subtle uppercase">Readiness</div>
              <div className="text-2xl font-bold font-mono text-gold flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>{student.readinessScore}%</span>
              </div>
              <div className="text-[10px] font-mono text-emerald-400">Profile Verified</div>
            </div>

            <div className="text-center px-3 border-l border-white/10">
              <div className="text-[10px] font-mono text-rvu-subtle uppercase">Offers</div>
              <div className="text-2xl font-bold font-mono text-sky-400">{studentOffers.length}</div>
              <div className="text-[10px] font-mono text-rvu-subtle">
                {studentOffers.filter(o => o.placementOfficeVerified).length} Verified
              </div>
            </div>

            <div className="text-center px-3 border-l border-white/10">
              <div className="text-[10px] font-mono text-rvu-subtle uppercase">Interviews</div>
              <div className="text-2xl font-bold font-mono text-white flex items-center justify-center gap-1">
                <CalendarCheck className="w-4 h-4 text-sky-400" />
                <span>{studentInterviews.length}</span>
              </div>
              <div className="text-[10px] font-mono text-rvu-subtle">
                {studentTickets.length > 0 ? `${studentTickets.length} Support Tickets` : 'Active'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAR Action Controls Bar */}
      <div className="p-4 rounded-xl bg-[#111C26] border border-gold-border/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-xs">
            <span className="text-rvu-muted">Official Eligibility Scope: </span>
            <span className="font-mono text-gold font-semibold">{student.eligibilityDriveScope || 'AY 2026–27 Campus Drives'}</span>
          </div>
          <span className="text-rvu-subtle">&bull;</span>
          <div className="text-xs">
            <span className="text-rvu-muted">Attestation: </span>
            <span className="font-mono text-white">{student.verifiedBy || 'CAR Office'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {editingEligibility ? (
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as PlacementStatus)}
                className="px-3 py-1.5 rounded-lg bg-[#142330] border border-gold text-xs text-white font-mono focus:outline-none"
              >
                <option value="ELIGIBLE">ELIGIBLE</option>
                <option value="PARTICIPATING">PARTICIPATING</option>
                <option value="SELECTED">SELECTED</option>
                <option value="PLACED">PLACED</option>
                <option value="INELIGIBLE">INELIGIBLE</option>
                <option value="OPTED_OUT">OPTED_OUT</option>
              </select>
              <button
                onClick={handleUpdateStatus}
                className="px-3 py-1.5 rounded-lg bg-gold text-navy-dark text-xs font-bold hover:bg-gold-light transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditingEligibility(false)}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-rvu-muted text-xs hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setSelectedStatus(student.placementStatus);
                setEditingEligibility(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-navy-card hover:bg-gold/10 border border-gold-border/40 text-gold text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Override Placement Status</span>
            </button>
          )}

          {student.isDeactivated ? (
            <button
              onClick={() => store.restoreStudent(student.id)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono hover:bg-emerald-500/30"
            >
              Restore Student Record
            </button>
          ) : (
            <button
              onClick={() => {
                const reason = prompt('Reason for deactivation / archiving:', 'Academic Disqualification / Exit');
                if (reason) store.deactivateStudent(student.id, reason);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-mono hover:bg-rose-500/20"
            >
              Deactivate Record
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gold-border/30 overflow-x-auto custom-scrollbar gap-2 text-xs font-mono">
        {[
          { key: 'OVERVIEW', label: 'Academic & Personal' },
          { key: 'APPLICATIONS', label: `Applications (${studentApplications.length})` },
          { key: 'OFFERS', label: `Offers (${studentOffers.length})` },
          { key: 'DOCUMENTS', label: `Documents (${studentDocuments.length})` },
          { key: 'TIMELINE', label: `Activity Trail (${studentAuditLogs.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-gold text-gold font-bold bg-gold/5'
                : 'border-transparent text-rvu-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Academic Details */}
          <div className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 space-y-3">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-gold" />
              <span>Academic Credentials</span>
            </h3>
            
            <div className="space-y-2 text-xs divide-y divide-white/5">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-rvu-muted">School:</span>
                <span className="text-white font-semibold">{student.school}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-rvu-muted">Programme:</span>
                <span className="text-white font-semibold">{student.programme}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-rvu-muted">Batch / Graduating Year:</span>
                <span className="font-mono text-white">{student.batch || '2023–2027'} ({student.graduationYear})</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-rvu-muted">Current Academic Stage:</span>
                <span className="font-mono text-white">{student.academicYear || `Semester ${student.semester || 6}`}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-rvu-muted">Cumulative GPA (CGPA):</span>
                <span className="font-mono text-gold font-bold text-sm">{student.cgpa.toFixed(2)} / 10.00</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-rvu-muted">Active Backlogs:</span>
                <span className={`font-mono font-bold ${student.activeBacklogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {student.activeBacklogs} Active Backlogs
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-rvu-muted">Attendance:</span>
                <span className="font-mono text-emerald-400 font-bold">{student.attendancePercentage}%</span>
              </div>
            </div>
          </div>

          {/* Skills & Gap Analysis */}
          <div className="p-5 rounded-xl bg-[#111C26] border border-gold-border/40 space-y-4">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Verified Skills & Competencies</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="px-2.5 py-1 rounded-lg bg-[#142330] border border-gold-border/30 text-xs text-white flex items-center gap-1.5"
                >
                  <span>{skill.name}</span>
                  <span className="text-[10px] font-mono text-gold px-1 rounded bg-gold/10">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>

            {student.internshipDetails && (
              <div className="pt-3 border-t border-white/5 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-rvu-subtle">
                  Prior Internship Experience
                </h4>
                <div className="p-2.5 rounded-lg bg-[#142330] border border-white/5 text-xs">
                  <div className="font-semibold text-white">
                    {student.internshipDetails.role || 'Intern'} &bull; {student.internshipDetails.company || 'Industry Partner'}
                  </div>
                  <div className="text-[10px] text-rvu-muted font-mono">
                    Status: {student.internshipDetails.status} &bull; Duration: {student.internshipDetails.duration || 'Semester-long'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: APPLICATIONS */}
      {activeTab === 'APPLICATIONS' && (
        <div className="rounded-xl bg-[#111C26] border border-gold-border/40 overflow-hidden">
          <div className="p-4 border-b border-gold-border/30 text-xs font-mono text-rvu-subtle">
            All Applications Submitted by {student.name} ({studentApplications.length})
          </div>

          <div className="divide-y divide-white/5 text-xs">
            {studentApplications.length === 0 ? (
              <div className="p-8 text-center text-rvu-muted">No applications submitted yet.</div>
            ) : (
              studentApplications.map((app) => (
                <div key={app.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{app.role}</div>
                    <div className="text-rvu-muted text-xs">{app.companyName} &bull; Applied: {new Date(app.submittedAt).toLocaleDateString()}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-gold/15 text-gold border border-gold/30">
                      {app.stage}
                    </span>
                    <button
                      onClick={() => onNavigate(`/management/applications`)}
                      className="text-xs text-gold hover:underline font-mono"
                    >
                      Inspect Pipeline &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: OFFERS */}
      {activeTab === 'OFFERS' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-[#111C26] border border-gold-border/40 p-4">
            <h3 className="text-sm font-bold text-white font-display mb-3">
              Offer Letters & Verification Desk
            </h3>

            {studentOffers.length === 0 ? (
              <div className="p-6 text-center text-rvu-muted text-xs">
                No offers recorded for this student yet.
              </div>
            ) : (
              <div className="space-y-3">
                {studentOffers.map((offer) => (
                  <div key={offer.id} className="p-4 rounded-xl bg-[#142330] border border-gold-border/30 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-gold" />
                        <span className="text-sm font-bold text-white">{offer.role} &bull; {offer.companyName}</span>
                      </div>
                      <div className="text-xs text-rvu-muted">
                        CTC: <strong className="text-gold font-mono">{offer.ctcLpa}</strong> &bull; Base: {offer.baseSalary} &bull; Location: {offer.location}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {offer.placementOfficeVerified ? (
                        <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>CAR VERIFIED</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            store.verifyOffer(offer.id, 'VERIFIED', 'Verified by Placement Director');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gold text-navy-dark font-bold text-xs hover:bg-gold-light"
                        >
                          Verify Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: DOCUMENTS */}
      {activeTab === 'DOCUMENTS' && (
        <div className="rounded-xl bg-[#111C26] border border-gold-border/40 p-4">
          <h3 className="text-sm font-bold text-white font-display mb-3">
            Verified SIS Dossier & Uploaded Documents
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {studentDocuments.length === 0 ? (
              <div className="col-span-3 text-center py-6 text-rvu-muted text-xs">
                No institutional documents uploaded.
              </div>
            ) : (
              studentDocuments.map((doc) => (
                <div key={doc.id} className="p-3 rounded-lg bg-[#142330] border border-gold-border/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gold">
                      {doc.type}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">Verified</span>
                  </div>
                  <div className="font-semibold text-white text-xs truncate">{doc.title}</div>
                  <div className="text-[10px] text-rvu-subtle font-mono">
                    Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="rounded-xl bg-[#111C26] border border-gold-border/40 p-5 space-y-3">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <History className="w-4 h-4 text-gold" />
            <span>Audit & Placement Activity Log</span>
          </h3>

          <div className="space-y-2">
            {studentAuditLogs.length === 0 ? (
              <div className="text-center py-6 text-rvu-muted text-xs">
                No audit events logged for this student record yet.
              </div>
            ) : (
              studentAuditLogs.map((log) => (
                <div key={log.id} className="flex items-start justify-between p-2.5 rounded-lg bg-[#142330] border border-white/5 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white">{log.action}</div>
                    <div className="text-rvu-muted text-[11px]">{log.details}</div>
                  </div>
                  <span className="text-[10px] font-mono text-rvu-subtle shrink-0">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
