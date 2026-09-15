import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Check,
  School
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface SettingsViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  store
}) => {
  const [settings, setSettings] = useState({ ...store.policySettings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updatePolicySettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              INSTITUTIONAL CONFIGURATION
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Placement Cell Policy & Rules Settings
          </h1>
          <p className="text-xs text-rvu-muted">
            Configure system-wide placement eligibility thresholds, dream offer multipliers, and academic constraints.
          </p>
        </div>

        {isSaved && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Settings Saved & Applied</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Eligibility Thresholds */}
        <div className="p-6 rounded-2xl bg-[#111C26] border border-gold-border/40 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>Academic Eligibility Baseline Rules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-rvu-muted mb-1">
                Minimum CGPA for Placement Drive Registration
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={settings.minCgpaDefault}
                onChange={(e) => setSettings({ ...settings, minCgpaDefault: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white font-mono focus:outline-none focus:border-gold"
              />
              <span className="text-[10px] text-rvu-subtle mt-1 block">
                Students below this threshold are automatically flagged as INELIGIBLE.
              </span>
            </div>

            <div>
              <label className="block text-rvu-muted mb-1">
                Maximum Active Backlogs Permitted
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={settings.maxBacklogsDefault}
                onChange={(e) => setSettings({ ...settings, maxBacklogsDefault: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white font-mono focus:outline-none focus:border-gold"
              />
              <span className="text-[10px] text-rvu-subtle mt-1 block">
                Standard RVU norm is 0 active backlogs at time of drive appearance.
              </span>
            </div>
          </div>
        </div>

        {/* Offer Policy Rules */}
        <div className="p-6 rounded-2xl bg-[#111C26] border border-gold-border/40 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
            <Settings className="w-4 h-4 text-gold" />
            <span>One-Student-One-Job & Dream Company Rules</span>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.oneStudentOneJobRule}
                onChange={(e) => setSettings({ ...settings, oneStudentOneJobRule: e.target.checked })}
                className="mt-0.5 rounded border-gold-border text-gold focus:ring-0"
              />
              <div>
                <span className="font-bold text-white block">
                  Enforce One-Student-One-Job Policy
                </span>
                <span className="text-rvu-muted text-[11px]">
                  Placed students cannot apply to standard core drives once they have a verified offer.
                </span>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-rvu-muted mb-1">
                  Dream Job CTC Upgrade Multiplier
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={settings.dreamJobMultiplier}
                    onChange={(e) => setSettings({ ...settings, dreamJobMultiplier: parseFloat(e.target.value) || 1.5 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white font-mono focus:outline-none focus:border-gold"
                  />
                  <span className="text-sm font-bold text-gold font-mono">&times;</span>
                </div>
                <span className="text-[10px] text-rvu-subtle mt-1 block">
                  Students may apply to a dream opportunity only if the offered CTC is &ge; {settings.dreamJobMultiplier}x their current verified offer.
                </span>
              </div>

              <div>
                <label className="block text-rvu-muted mb-1">
                  Offer Acceptance Window (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.offerAcceptanceWindowDays}
                  onChange={(e) => setSettings({ ...settings, offerAcceptanceWindowDays: parseInt(e.target.value) || 3 })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white font-mono focus:outline-none focus:border-gold"
                />
                <span className="text-[10px] text-rvu-subtle mt-1 block">
                  Candidate must formally accept or forfeit within this statutory window.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 9 Official Schools Master Reference */}
        <div className="p-6 rounded-2xl bg-[#111C26] border border-gold-border/40 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
              <School className="w-4 h-4 text-gold" />
              <span>Official Institutional School Master (9 Schools)</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Verified RVU Master
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {settings.officialSchools.map((school, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#142330] border border-white/5 text-xs text-rvu-text flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                <span className="truncate">{school}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold text-navy-dark hover:bg-gold-light text-xs font-bold shadow-lg transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Save Placement Policies</span>
          </button>
        </div>

      </form>

    </div>
  );
};
