import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Save
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface CompanyProfileViewProps {
  store: PlatformStoreState;
  onNavigate?: (route: string) => void;
}

export const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({
  store
}) => {
  const company = store.activeCompany;

  const [name, setName] = useState(company?.name || 'TechnoSphere Systems');
  const [industry, setIndustry] = useState(company?.industry || 'Enterprise Software & Cloud Platforms');
  const [headquarters, setHeadquarters] = useState(company?.headquarters || 'Bengaluru, Karnataka');
  const [website, setWebsite] = useState(company?.website || 'https://technosphere.io');
  const [overview, setOverview] = useState(
    company?.overview ||
    'TechnoSphere Systems is a leading enterprise cloud orchestration platform delivering distributed infrastructure automation, Kubernetes orchestration, and AI systems tooling.'
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateCompanyProfile({
      name,
      industry,
      headquarters,
      website,
      overview
    });
    setSuccessMsg('Corporate profile updated and synced with RVU Career Hub records.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Organization Profile & Employer Branding
        </h1>
        <p className="text-xs text-gray-400">
          Manage your company identity, institutional verification credentials, and campus branding
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

      {/* Profile Card */}
      <div className="p-6 rounded-2xl bg-[#19252F] border border-[#CCAA68]/20 space-y-6 shadow-xl">
        <div className="flex items-center gap-4 border-b border-[#CCAA68]/15 pb-4">
          <div className="w-16 h-16 rounded-xl bg-[#20303A] border border-[#CCAA68]/40 flex items-center justify-center text-[#CCAA68] font-bold text-2xl flex-shrink-0">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white truncate">{company?.name}</h2>
              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CAR Verified Corporate Partner</span>
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Partner Tier: <strong className="text-[#CCAA68]">{company?.tier || 'TIER_1_MARQUEE'}</strong> • Established {company?.establishedYear || 2018}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Company Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Industry Vertical *</label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                required
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Headquarters Location *</label>
              <input
                type="text"
                value={headquarters}
                onChange={e => setHeadquarters(e.target.value)}
                required
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-medium">Official Website *</label>
              <input
                type="url"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                required
                className="w-full bg-[#20303A] text-white p-2.5 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-300 font-medium">Company Overview & Culture *</label>
            <textarea
              rows={4}
              value={overview}
              onChange={e => setOverview(e.target.value)}
              required
              className="w-full bg-[#20303A] text-white p-3 rounded-lg border border-[#CCAA68]/20 focus:outline-none focus:border-[#CCAA68]"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-[#CCAA68]/15">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#CCAA68] hover:bg-[#D8B978] text-[#101A22] font-semibold text-xs transition-colors shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Corporate Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
