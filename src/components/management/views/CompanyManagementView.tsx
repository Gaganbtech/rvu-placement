import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import type { CompanyRecord } from '../../../data/platform/types';

interface CompanyManagementViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const CompanyManagementView: React.FC<CompanyManagementViewProps> = ({
  store
}) => {
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New company form
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'Enterprise Software & Cloud',
    tier: 'Marquee' as 'Marquee' | 'Dream' | 'Core' | 'Mass',
    contactPerson: '',
    contactEmail: '',
    website: 'https://',
    description: ''
  });

  const filteredCompanies = store.companies.filter(comp => {
    if (selectedTier !== 'ALL' && comp.tier !== selectedTier) return false;
    if (selectedStatus !== 'ALL' && comp.verificationStatus !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = comp.name.toLowerCase().includes(q);
      const matchInd = comp.industry.toLowerCase().includes(q);
      if (!matchName && !matchInd) return false;
    }
    return true;
  });

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name.trim()) return;

    const company: CompanyRecord = {
      id: `comp_${Date.now()}`,
      name: newCompany.name.trim(),
      industry: newCompany.industry,
      headquarters: 'Bengaluru, India',
      tier: newCompany.tier,
      primaryContactName: newCompany.contactPerson,
      primaryContactEmail: newCompany.contactEmail,
      website: newCompany.website,
      verificationStatus: 'VERIFIED',
      activeOpportunitiesCount: 0,
      totalPlacements: 0,
      highestPackageLPA: 18.0
    };

    store.addCompany(company);
    setShowAddModal(false);
    setNewCompany({
      name: '',
      industry: 'Enterprise Software & Cloud',
      tier: 'Marquee',
      contactPerson: '',
      contactEmail: '',
      website: 'https://',
      description: ''
    });
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Marquee':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold/20 text-gold border border-gold/40">MARQUEE TIER-1</span>;
      case 'Dream':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">DREAM TIER</span>;
      case 'Core':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">CORE TIER-2</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-rvu-muted">MASS / REGULAR</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              INDUSTRY & CORPORATE RELATIONS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              {store.companies.length} Registered Partners
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Corporate Partners Directory
          </h1>
          <p className="text-xs text-rvu-muted">
            Institutional corporate relationships, recruitment tiering, and active placement pipeline partnerships.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gold text-navy-dark hover:bg-gold-light text-xs font-bold shadow transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Corporate Partner</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 p-3.5 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-rvu-subtle absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search companies by name or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white placeholder-rvu-subtle focus:outline-none focus:border-gold"
          />
        </div>

        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white focus:outline-none focus:border-gold"
        >
          <option value="ALL">All Tiers</option>
          <option value="TIER_1_MARQUEE">Marquee (Tier 1)</option>
          <option value="TIER_2_CORE">Core (Tier 2)</option>
          <option value="TIER_3_EMERGING">Emerging (Tier 3)</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white focus:outline-none focus:border-gold"
        >
          <option value="ALL">All Statuses</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* Companies Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="rounded-xl bg-[#111C26] border border-gold-border/40 p-5 space-y-4 hover:border-gold/60 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-base shadow">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{company.name}</h3>
                    <div className="text-[11px] text-rvu-muted">{company.industry}</div>
                  </div>
                </div>
                {getTierBadge(company.tier)}
              </div>

              <div className="p-3 rounded-lg bg-[#142330] border border-white/5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-rvu-muted">Contact:</span>
                  <span className="text-white font-medium">{company.primaryContactName || 'Office of HR'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-rvu-muted">Email:</span>
                  <span className="font-mono text-rvu-subtle">{company.primaryContactEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-rvu-muted">Total Placements:</span>
                  <span className="font-mono text-emerald-400 font-bold">{company.totalPlacements}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Partner</span>
              </div>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#111C26] border border-gold-border/60 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gold" />
                <h3 className="text-base font-bold text-white font-display">
                  Register Corporate Partner
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-rvu-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCompany} className="space-y-4 text-xs">
              <div>
                <label className="block text-rvu-muted mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco Systems"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-rvu-muted mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={newCompany.industry}
                    onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-rvu-muted mb-1">Recruitment Tier</label>
                  <select
                    value={newCompany.tier}
                    onChange={(e) => setNewCompany({ ...newCompany, tier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  >
                    <option value="Marquee">Tier 1 (Marquee)</option>
                    <option value="Dream">Dream Tier</option>
                    <option value="Core">Tier 2 (Core)</option>
                    <option value="Mass">Mass / Regular</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-rvu-muted mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="HR Lead"
                    value={newCompany.contactPerson}
                    onChange={(e) => setNewCompany({ ...newCompany, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-rvu-muted mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="campus@company.com"
                    value={newCompany.contactEmail}
                    onChange={(e) => setNewCompany({ ...newCompany, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gold text-navy-dark font-bold text-xs hover:bg-gold-light"
                >
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
