import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Upload,
  UserPlus,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { PlacementStatus } from '../../../data/platform/types';
import type { PlatformStoreState } from '../../../data/platform/studentStore';
import { OFFICIAL_RVU_SCHOOLS } from '../../../data/platform/demoData';

interface StudentManagementViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const StudentManagementView: React.FC<StudentManagementViewProps> = ({
  store,
  onNavigate
}) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [minCgpa, setMinCgpa] = useState<string>('ALL');
  const [showDeactivated, setShowDeactivated] = useState(false);
  
  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered students
  const filteredStudents = useMemo(() => {
    return store.students.filter((student) => {
      // Deactivated toggle
      if (!showDeactivated && student.isDeactivated) return false;
      if (showDeactivated && !student.isDeactivated) return false;

      // School filter
      if (selectedSchool !== 'ALL' && student.school !== selectedSchool) return false;

      // Status filter
      if (selectedStatus !== 'ALL' && student.placementStatus !== selectedStatus) return false;

      // CGPA filter
      if (minCgpa !== 'ALL') {
        const threshold = parseFloat(minCgpa);
        if (student.cgpa < threshold) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesId = student.id.toLowerCase().includes(q) || (student.universityRegisterNumber && student.universityRegisterNumber.toLowerCase().includes(q));
        const matchesEmail = student.email.toLowerCase().includes(q);
        const matchesProgram = student.programme.toLowerCase().includes(q);
        const matchesSkill = student.skills.some(s => s.name.toLowerCase().includes(q));
        if (!matchesName && !matchesId && !matchesEmail && !matchesProgram && !matchesSkill) {
          return false;
        }
      }

      return true;
    });
  }, [store.students, searchQuery, selectedSchool, selectedStatus, minCgpa, showDeactivated]);

  // Paginated students
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage]);

  // Bulk actions handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedStudents.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (status: PlacementStatus) => {
    if (selectedIds.length === 0) return;
    store.bulkUpdatePlacementStatus(selectedIds, status);
    setSelectedIds([]);
  };

  const handleBulkDeactivate = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Deactivate ${selectedIds.length} students? They will be hidden from active placement rosters.`)) {
      selectedIds.forEach(id => store.deactivateStudent(id, 'Bulk admin deactivation'));
      setSelectedIds([]);
    }
  };

  const handleBulkRestore = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => store.restoreStudent(id));
    setSelectedIds([]);
  };

  // Export filtered list to CSV
  const handleExportCSV = () => {
    const headers = ['Student ID', 'University Reg No', 'Name', 'Email', 'School', 'Programme', 'Batch', 'CGPA', 'Backlogs', 'Placement Status', 'Readiness Score'];
    const rows = filteredStudents.map(s => [
      s.id,
      s.universityRegisterNumber || '',
      `"${s.name}"`,
      s.email,
      `"${s.school}"`,
      `"${s.programme}"`,
      s.batch,
      s.cgpa,
      s.activeBacklogs,
      s.placementStatus,
      s.readinessScore
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RVU_Student_Cohort_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: PlacementStatus) => {
    switch (status) {
      case 'ELIGIBLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">ELIGIBLE</span>;
      case 'PLACED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold/20 text-gold border border-gold/40">PLACED</span>;
      case 'OFFERED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">OFFERED</span>;
      case 'INTERVIEWING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">INTERVIEWING</span>;
      case 'SHORTLISTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">SHORTLISTED</span>;
      case 'INELIGIBLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">INELIGIBLE</span>;
      case 'OPTED_OUT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-500/20 text-gray-400 border border-gray-500/40">OPTED OUT</span>;
      case 'APPLIED':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">APPLIED</span>;
    }
  };

  return (
    <div className="space-y-5 pb-12">
      
      {/* Header with Title and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-gold uppercase tracking-wider font-semibold">
              INSTITUTIONAL SIS MASTER
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-rvu-muted">
              {filteredStudents.length} Students Active
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            Student Cohort Master Directory
          </h1>
          <p className="text-xs text-rvu-muted">
            Manage academic profiles, placement eligibility, drive allotments, and verified credentials across all 9 schools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('/management/students/import')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gold text-navy-dark hover:bg-gold-light text-xs font-semibold shadow transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Import Excel</span>
          </button>
          
          <button
            onClick={() => onNavigate('/management/students/new')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-card hover:bg-white/10 text-white text-xs font-medium border border-gold-border/40 transition-all"
          >
            <UserPlus className="w-4 h-4 text-gold" />
            <span>Add Student</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-card hover:bg-white/10 text-rvu-muted hover:text-white text-xs font-medium border border-gold-border/40 transition-all"
            title="Export filtered roster to CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-rvu-subtle absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Name, USN, Email, or Skill..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white placeholder-rvu-subtle focus:outline-none focus:border-gold"
            />
          </div>

          {/* School Filter */}
          <div>
            <select
              value={selectedSchool}
              onChange={(e) => {
                setSelectedSchool(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white focus:outline-none focus:border-gold"
            >
              <option value="ALL">All Schools (9)</option>
              {OFFICIAL_RVU_SCHOOLS.map(sch => (
                <option key={sch} value={sch}>{sch}</option>
              ))}
            </select>
          </div>

          {/* Placement Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white focus:outline-none focus:border-gold"
            >
              <option value="ALL">All Placement Statuses</option>
              <option value="ELIGIBLE">Eligible</option>
              <option value="PLACED">Placed</option>
              <option value="OFFERED">Offered</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INELIGIBLE">Ineligible</option>
              <option value="OPTED_OUT">Opted Out</option>
            </select>
          </div>

          {/* CGPA Filter */}
          <div>
            <select
              value={minCgpa}
              onChange={(e) => {
                setMinCgpa(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-[#142330] border border-gold-border/40 text-xs text-white focus:outline-none focus:border-gold"
            >
              <option value="ALL">All CGPA Ranges</option>
              <option value="8.5">&ge; 8.5 (Distinction)</option>
              <option value="7.5">&ge; 7.5 (First Class+)</option>
              <option value="6.5">&ge; 6.5 (First Class)</option>
              <option value="6.0">&ge; 6.0 (Placement Baseline)</option>
            </select>
          </div>

        </div>

        {/* Sub-bar: Active / Deactivated Toggle & Active Filter Count */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-rvu-muted">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showDeactivated}
                onChange={(e) => {
                  setShowDeactivated(e.target.checked);
                  setCurrentPage(1);
                  setSelectedIds([]);
                }}
                className="rounded border-gold-border text-gold focus:ring-0"
              />
              <span className={showDeactivated ? 'text-amber-400 font-semibold' : 'text-rvu-muted'}>
                Show Deactivated / Archived Profiles
              </span>
            </label>
          </div>

          <div className="font-mono text-[11px] text-rvu-subtle">
            Showing {filteredStudents.length} of {store.students.length} students
          </div>
        </div>
      </div>

      {/* Bulk Action Floating Bar when rows are selected */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-gold/15 border border-gold shadow-lg animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-mono text-gold font-bold">
            <Users className="w-4 h-4" />
            <span>{selectedIds.length} student{selectedIds.length > 1 ? 's' : ''} selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!showDeactivated ? (
              <>
                <button
                  onClick={() => handleBulkStatusChange('ELIGIBLE')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Eligible</span>
                </button>
                <button
                  onClick={() => handleBulkStatusChange('INELIGIBLE')}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/40 transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Mark Ineligible</span>
                </button>
                <button
                  onClick={handleBulkDeactivate}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Deactivate</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleBulkRestore}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Selected</span>
              </button>
            )}
            
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-xl bg-[#111C26] border border-gold-border/40 overflow-hidden shadow-lg">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0D161E] border-b border-gold-border/30 text-rvu-subtle font-mono text-[11px] uppercase tracking-wider">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedStudents.length > 0 && selectedIds.length === paginatedStudents.length}
                    onChange={handleSelectAll}
                    className="rounded border-gold-border text-gold focus:ring-0"
                  />
                </th>
                <th className="p-3">Student & Roll No</th>
                <th className="p-3">School & Programme</th>
                <th className="p-3">Batch</th>
                <th className="p-3 text-center">CGPA / Backlogs</th>
                <th className="p-3 text-center">Placement Status</th>
                <th className="p-3 text-center">Readiness</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-rvu-muted">
                    <Users className="w-8 h-8 text-rvu-subtle mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-white">No students match the current criteria.</p>
                    <p className="text-xs text-rvu-subtle mt-1">Try broadening your search query or reset filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const isSelected = selectedIds.includes(student.id);
                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-white/5 transition-colors ${
                        isSelected ? 'bg-gold/5' : ''
                      } ${student.isDeactivated ? 'opacity-60 bg-rose-950/10' : ''}`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(student.id)}
                          className="rounded border-gold-border text-gold focus:ring-0"
                        />
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-xs shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <button
                              onClick={() => onNavigate(`/management/students/${student.id}`)}
                              className="font-semibold text-white hover:text-gold text-left transition-colors truncate block max-w-[200px]"
                            >
                              {student.name}
                            </button>
                            <div className="text-[10px] font-mono text-rvu-subtle">
                              USN: {student.universityRegisterNumber || student.id}
                            </div>
                            <div className="text-[10px] text-rvu-subtle truncate max-w-[200px]">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-medium text-rvu-text truncate max-w-[220px]" title={student.programme}>
                          {student.programme}
                        </div>
                        <div className="text-[10px] text-rvu-subtle font-mono truncate max-w-[220px]" title={student.school}>
                          {student.school}
                        </div>
                      </td>

                      <td className="p-3 font-mono text-rvu-muted">
                        {student.batch}
                      </td>

                      <td className="p-3 text-center">
                        <div className="font-mono font-bold text-white">
                          {student.cgpa.toFixed(2)}
                        </div>
                        <div className={`text-[10px] font-mono ${student.activeBacklogs > 0 ? 'text-rose-400 font-semibold' : 'text-emerald-400'}`}>
                          {student.activeBacklogs > 0 ? `${student.activeBacklogs} Backlogs` : '0 Backlogs'}
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        {getStatusBadge(student.placementStatus)}
                      </td>

                      <td className="p-3 text-center">
                        <div className="inline-flex items-center gap-1 font-mono text-gold font-semibold">
                          <Sparkles className="w-3 h-3 text-gold" />
                          <span>{student.readinessScore}%</span>
                        </div>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              const doc = store.documents.find(d => d.studentId === student.id && d.type === 'RESUME');
                              const fileName = doc?.fileName || `${student.name.replace(/\s+/g, '_')}_Resume.txt`;
                              const fallback = `RV UNIVERSITY PLACEMENT DOSSIER\nStudent: ${student.name} (${student.id})\nProgramme: ${student.programme}\nCGPA: ${student.cgpa}\nSkills: ${student.skills.map(s => s.name).join(', ')}\nEligibility: ${student.eligibilityStatus}\nPlacement Status: ${student.placementStatus}`;
                              const anchor = document.createElement('a');
                              anchor.href = doc?.fileDataUrl || `data:text/plain;charset=utf-8,${encodeURIComponent(fallback)}`;
                              anchor.download = fileName;
                              document.body.appendChild(anchor);
                              anchor.click();
                              document.body.removeChild(anchor);
                            }}
                            className="p-1.5 rounded-lg bg-navy-card hover:bg-gold/20 text-rvu-muted hover:text-gold border border-gold-border/30 transition-colors"
                            title="Download Verified Resume"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onNavigate(`/management/students/${student.id}`)}
                            className="p-1.5 rounded-lg bg-navy-card hover:bg-gold/20 text-rvu-muted hover:text-gold border border-gold-border/30 transition-colors"
                            title="View 360 Institutional Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {!student.isDeactivated ? (
                            <button
                              onClick={() => {
                                if (confirm(`Deactivate student profile for ${student.name}?`)) {
                                  store.deactivateStudent(student.id, 'Admin manual deactivation');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-navy-card hover:bg-rose-500/20 text-rvu-muted hover:text-rose-400 border border-gold-border/30 transition-colors"
                              title="Deactivate Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => store.restoreStudent(student.id)}
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors"
                              title="Restore Profile"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 bg-[#0D161E] border-t border-gold-border/30 flex items-center justify-between text-xs text-rvu-muted">
          <div className="font-mono text-[11px]">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded-lg bg-navy-card border border-gold-border/30 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded-lg bg-navy-card border border-gold-border/30 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
