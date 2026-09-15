import React, { useState } from 'react';
import {
  Settings,
  Bell,
  CheckCircle2,
  Save
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface RecruiterSettingsViewProps {
  store: PlatformStoreState;
}

export const RecruiterSettingsView: React.FC<RecruiterSettingsViewProps> = ({
  store: _store
}) => {
  const [notifyApplications, setNotifyApplications] = useState(true);
  const [notifyCarApprovals, setNotifyCarApprovals] = useState(true);
  const [notifyAssessmentScores, setNotifyAssessmentScores] = useState(true);
  const [notifyInterviewReminders, setNotifyInterviewReminders] = useState(true);
  const [defaultPlatform, setDefaultPlatform] = useState('HackerRank Proctored');
  const [defaultInterviewMode, setDefaultInterviewMode] = useState('In-person');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('Recruiter preferences and alert thresholds saved.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Recruitment Workspace Settings
        </h1>
        <p className="text-xs text-gray-400">
          Configure real-time communication preferences, default test platforms, and security
        </p>
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

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Notification Preferences */}
        <div className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4 shadow-xl">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#CCAA68]" />
            <span>Real-Time Alert Channels</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-[#20303A] cursor-pointer">
              <div>
                <div className="font-semibold text-white">New Candidate Applications</div>
                <div className="text-[11px] text-gray-400">Receive alerts when pre-screened RVU students apply</div>
              </div>
              <input
                type="checkbox"
                checked={notifyApplications}
                onChange={e => setNotifyApplications(e.target.checked)}
                className="w-4 h-4 accent-[#CCAA68]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#20303A] cursor-pointer">
              <div>
                <div className="font-semibold text-white">CAR Institutional Approval Updates</div>
                <div className="text-[11px] text-gray-400">Notifications when opportunities or drive venues are verified by CAR</div>
              </div>
              <input
                type="checkbox"
                checked={notifyCarApprovals}
                onChange={e => setNotifyCarApprovals(e.target.checked)}
                className="w-4 h-4 accent-[#CCAA68]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#20303A] cursor-pointer">
              <div>
                <div className="font-semibold text-white">Assessment Submission Alerts</div>
                <div className="text-[11px] text-gray-400">Alerts when candidates complete proctored coding challenges</div>
              </div>
              <input
                type="checkbox"
                checked={notifyAssessmentScores}
                onChange={e => setNotifyAssessmentScores(e.target.checked)}
                className="w-4 h-4 accent-[#CCAA68]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-[#20303A] cursor-pointer">
              <div>
                <div className="font-semibold text-white">Interview Schedule Reminders</div>
                <div className="text-[11px] text-gray-400">Send reminder 2 hours prior to scheduled panel discussions</div>
              </div>
              <input
                type="checkbox"
                checked={notifyInterviewReminders}
                onChange={e => setNotifyInterviewReminders(e.target.checked)}
                className="w-4 h-4 accent-[#CCAA68]"
              />
            </label>
          </div>
        </div>

        {/* Platform Defaults */}
        <div className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4 shadow-xl">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#CCAA68]" />
            <span>Testing & Interview Defaults</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Default Online Assessment Platform</label>
              <select
                value={defaultPlatform}
                onChange={e => setDefaultPlatform(e.target.value)}
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
              >
                <option value="HackerRank Proctored">HackerRank Proctored</option>
                <option value="Mettle Online Assessment">Mettle Online Assessment</option>
                <option value="Codility Proctored">Codility Proctored</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Preferred Interview Mode</label>
              <select
                value={defaultInterviewMode}
                onChange={e => setDefaultInterviewMode(e.target.value)}
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none"
              >
                <option value="In-person">In-Person (RVU Campus Block 2)</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
