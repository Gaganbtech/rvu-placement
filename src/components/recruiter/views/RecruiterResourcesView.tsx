import React from 'react';
import {
  BookOpen,
  Download,
  ShieldCheck,
  Mail,
  Phone,
  Building
} from 'lucide-react';
import { RVU_BRAND } from '../../../data/rvu';

interface RecruiterResourcesViewProps {
  onNavigate: (route: string) => void;
}

export const RecruiterResourcesView: React.FC<RecruiterResourcesViewProps> = () => {
  const policyDocs = [
    {
      title: 'RVU Corporate Recruitment Policy & Guidelines (2026–27)',
      code: 'DOC-POLICY-2026',
      size: '1.4 MB PDF',
      desc: 'Official governance rules regarding recruitment drives, offer rollouts, multi-offer tiers, and statutory compliance.'
    },
    {
      title: 'Multi-Offer Policy & Dream / Marquee Tier Thresholds',
      code: 'DOC-TIERS-2026',
      size: '840 KB PDF',
      desc: 'Details on 1.5x Dream Job rule, Dream Tier minimum (₹12.0 LPA), and Marquee Tier minimum (₹20.0 LPA).'
    },
    {
      title: 'Campus Computer Lab & Technical Proctoring Specifications',
      code: 'DOC-INFRA-401',
      size: '620 KB PDF',
      desc: 'Workstation specifications for Academic Block 2 Labs 401 & 402, leased lines, and authorized IDE software.'
    },
    {
      title: 'RV University Academic Calendar & Hiring Drive Windows',
      code: 'DOC-CALENDAR-2026',
      size: '980 KB PDF',
      desc: 'Key mid-semester evaluations, final examination dates, and zero-conflict recruitment windows.'
    }
  ];

  const carContacts = [
    {
      name: 'Dr. S. Ranganathan',
      role: 'Head, Corporate & Alumni Relations (CAR)',
      email: 'car.placements@rvu.edu.in',
      phone: '+91 80 6717 8000 (Ext 401)',
      office: 'Administration Block, Suite 204'
    },
    {
      name: 'Mr. Pradeep Kumar',
      role: 'Senior Placement Officer (Operations & Corporate Liaison)',
      email: 'pradeep.kumar@rvu.edu.in',
      phone: '+91 98860 99912',
      office: 'Placement Office, Academic Block 1'
    },
    {
      name: 'Prof. Ananya Sen',
      role: 'Faculty Placement Coordinator (Computer Science & Engineering)',
      email: 'ananya.sen@rvu.edu.in',
      phone: '+91 80 6717 8045',
      office: 'School of Computer Science & Engineering'
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          RV University Recruitment Resources & Policies
        </h1>
        <p className="text-xs text-gray-400">
          Official institutional handbooks, compliance policies, campus infrastructure guides, and CAR contact directory
        </p>
      </div>

      {/* Brand Identity Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#101A22] to-[#19252F] border border-[#CCAA68]/30 space-y-2">
        <div className="text-xs font-mono text-[#CCAA68] uppercase tracking-wider">Official University Motto</div>
        <div className="text-xl font-bold text-white tracking-tight font-serif italic">
          "{RVU_BRAND.tagline}"
        </div>
        <p className="text-xs text-gray-300 max-w-2xl leading-relaxed pt-1">
          RV University is dedicated to excellence in interdisciplinary education, cutting-edge engineering, liberal arts, and corporate synergy. Our placement protocols guarantee meritocratic opportunities, transparent compensation, and verified student credentials.
        </p>
      </div>

      {/* Policy Documents Grid */}
      <div className="p-6 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <div className="flex items-center gap-2 text-white">
          <BookOpen className="w-5 h-5 text-[#CCAA68]" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            Governance & Compliance Handbooks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {policyDocs.map((doc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#20303A] border border-white/5 hover:border-[#CCAA68]/40 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-white text-xs leading-snug">{doc.title}</div>
                  <span className="text-[10px] bg-[#101A22] text-[#CCAA68] px-2 py-0.5 rounded font-mono border border-white/10 flex-shrink-0">
                    {doc.code}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{doc.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-gray-400 text-[10px]">{doc.size}</span>
                <button
                  onClick={() => alert(`Downloading ${doc.title}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#CCAA68]/15 hover:bg-[#CCAA68] text-[#D8B978] hover:text-[#101A22] font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAR Team & Escalation Contacts */}
      <div className="p-6 rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-4">
        <div className="flex items-center gap-2 text-white">
          <ShieldCheck className="w-5 h-5 text-[#CCAA68]" />
          <h2 className="text-sm font-semibold uppercase tracking-wider">
            Office of Corporate & Alumni Relations (CAR) Leadership
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {carContacts.map((contact, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#20303A] border border-white/5 space-y-2 text-xs">
              <div>
                <div className="font-bold text-white text-sm">{contact.name}</div>
                <div className="text-[11px] text-[#CCAA68]">{contact.role}</div>
              </div>

              <div className="space-y-1 text-gray-300 text-[11px] pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{contact.office}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
