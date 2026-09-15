import React, { useState } from 'react';
import { 
  Clock, 
  MapPin
} from 'lucide-react';
import type { PlacementCalendarEvent, Student } from '../../../data/platform/types';
import { Button } from '../../ui/Button';

interface StudentCalendarViewProps {
  student: Student;
  calendarEvents: PlacementCalendarEvent[];
  onNavigate: (route: string) => void;
}

export const StudentCalendarView: React.FC<StudentCalendarViewProps> = ({
  student,
  calendarEvents,
  onNavigate
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'DRIVE' | 'ASSESSMENT' | 'DEADLINE'>('ALL');

  const filteredEvents = calendarEvents.filter((ev) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'DRIVE') return ev.eventType === 'PLACEMENT_DRIVE' || ev.eventType === 'PRE_PLACEMENT_TALK';
    if (selectedFilter === 'ASSESSMENT') return ev.eventType === 'ASSESSMENT' || ev.eventType === 'INTERVIEW';
    if (selectedFilter === 'DEADLINE') return ev.eventType === 'DEADLINE';
    return true;
  });

  const getEventBadge = (type: PlacementCalendarEvent['eventType']) => {
    switch (type) {
      case 'PLACEMENT_DRIVE':
        return { label: 'Campus Drive', bg: 'bg-gold/15 text-gold border-gold/30' };
      case 'ASSESSMENT':
        return { label: 'Online Assessment', bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30' };
      case 'INTERVIEW':
        return { label: 'Technical Interview', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'DEADLINE':
        return { label: 'Application Deadline', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      case 'PRE_PLACEMENT_TALK':
        return { label: 'Pre-Placement Talk', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      default:
        return { label: 'Placement Event', bg: 'bg-white/10 text-white border-white/20' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-navy-card border border-gold-border/60 p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-gold uppercase font-bold px-2 py-0.5 rounded bg-gold/15 border border-gold/30">
                CAMPUS PLACEMENT CHRONOLOGY
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                CAR Live Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Placement Calendar
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Synchronized with the Corporate & Alumni Relations (CAR) central schedule. All mandatory briefings, drive dates, coding tests, and interviews for {student.name} ({student.programme}) appear here.
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-white/10 sm:pl-6 shrink-0">
            <div className="text-2xl font-bold font-mono text-gold">
              {calendarEvents.length}
            </div>
            <div className="text-xs text-rvu-subtle font-mono">
              Upcoming Events
            </div>
          </div>
        </div>

        {/* Month View Switcher / Filter */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { key: 'ALL', label: 'All Scheduled' },
              { key: 'DRIVE', label: 'Campus Drives & PPTs' },
              { key: 'ASSESSMENT', label: 'Assessments & Interviews' },
              { key: 'DEADLINE', label: 'Registration Deadlines' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedFilter(tab.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedFilter === tab.key
                    ? 'bg-gold text-navy-dark font-bold'
                    : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-rvu-subtle hidden sm:inline">
            September – October 2026
          </span>
        </div>
      </div>

      {/* Events Chronological Feed */}
      <div className="space-y-4">
        {filteredEvents.map((ev) => {
          const badge = getEventBadge(ev.eventType);

          return (
            <div
              key={ev.id}
              className="rounded-2xl bg-navy-card border border-gold-border/40 hover:border-gold/60 transition-all p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card"
            >
              <div className="flex items-start gap-4">
                {/* Date Box */}
                <div className="w-16 h-16 rounded-2xl bg-[#0E1720] border border-gold-border/40 flex flex-col items-center justify-center text-center shrink-0">
                  <span className="text-[10px] font-mono text-gold uppercase">
                    {new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-bold font-mono text-white">
                    {new Date(ev.date).getDate()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.2 rounded border font-bold ${badge.bg}`}>
                      {badge.label}
                    </span>
                    {ev.companyName && (
                      <span className="text-xs text-rvu-muted font-medium">
                        {ev.companyName}
                      </span>
                    )}
                    {ev.isMandatory && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase">
                        Mandatory
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white font-display">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-rvu-muted leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-rvu-subtle pt-1">
                    <span className="flex items-center gap-1 text-gold">
                      <Clock className="w-3.5 h-3.5" />
                      {ev.startTime} - {ev.endTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rvu-subtle" />
                      {ev.venueOrLink}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="sm:text-right shrink-0">
                {ev.eventType === 'ASSESSMENT' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate('/student/applications')}
                    className="text-xs py-1.5"
                  >
                    Go to Assessment
                  </Button>
                )}
                {ev.eventType === 'PLACEMENT_DRIVE' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onNavigate('/student/drives')}
                    className="text-xs py-1.5"
                  >
                    View Drive Details
                  </Button>
                )}
                {ev.eventType === 'DEADLINE' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onNavigate('/student/opportunities')}
                    className="text-xs py-1.5"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
