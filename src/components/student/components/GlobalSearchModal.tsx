import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Briefcase, 
  FileText, 
  Building, 
  FolderLock, 
  Calendar, 
  ChevronRight, 
  Sparkles
} from 'lucide-react';
import { StudentIntelligenceService } from '../../../services/studentIntelligenceService';
import type { 
  Opportunity, 
  Application, 
  PlacementDrive, 
  StudentDocument, 
  PlacementCalendarEvent,
  PreparationTrack,
  StudentSearchItem
} from '../../../data/platform/types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  data: {
    opportunities: Opportunity[];
    applications: Application[];
    drives: PlacementDrive[];
    tracks: PreparationTrack[];
    documents: StudentDocument[];
    events: PlacementCalendarEvent[];
  };
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  data
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results: StudentSearchItem[] = query.trim()
    ? StudentIntelligenceService.globalSearch(query, data)
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (results.length || 1)) % (results.length || 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      onNavigate(results[selectedIndex].route);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getCategoryIcon = (category: StudentSearchItem['category']) => {
    switch (category) {
      case 'Opportunity':
        return <Briefcase className="w-4 h-4 text-gold" />;
      case 'Application':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'Drive':
        return <Building className="w-4 h-4 text-sky-400" />;
      case 'Preparation':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Document':
        return <FolderLock className="w-4 h-4 text-amber-400" />;
      case 'Event':
      default:
        return <Calendar className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div 
        className="card-glass rounded-2xl border border-gold-border/60 bg-navy-surface max-w-2xl w-full shadow-2xl overflow-hidden animate-fadeIn"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gold-border/30 flex items-center gap-3">
          <Search className="w-5 h-5 text-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search opportunities, applications, drives, skills, calendar..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-rvu-subtle focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-rvu-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-rvu-subtle bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {!query.trim() ? (
            <div className="p-6 text-center text-xs text-rvu-subtle">
              <p className="font-mono text-gold mb-1">GLOBAL STUDENT SPOTLIGHT SEARCH</p>
              <p>Type keywords like "Python", "Aviatrix", "Resume", "Drive", or "Interview" to quickly locate career resources.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-rvu-muted">
              <p className="font-bold text-white mb-1">No matching career resources found.</p>
              <p className="text-rvu-subtle">Try broadening your search term or check active filters in the relevant section.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.route);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-gold-faint border border-gold/40 text-white'
                        : 'hover:bg-white/5 text-rvu-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-navy-dark border border-white/10 flex items-center justify-center shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-gold' : 'text-white'}`}>
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-rvu-subtle">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-rvu-subtle line-clamp-1">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gold border border-gold/20 hidden sm:inline">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-rvu-subtle" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-2.5 bg-navy-dark/90 border-t border-gold-border/20 flex items-center justify-between text-[10px] font-mono text-rvu-subtle px-4">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>RVU Career Hub Intelligence</span>
        </div>
      </div>
    </div>
  );
};
