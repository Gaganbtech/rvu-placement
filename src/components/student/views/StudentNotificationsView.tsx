import React, { useState } from 'react';
import { 
  Bell, 
  ArrowRight, 
  CheckCheck
} from 'lucide-react';
import type { PlacementNotification, Student } from '../../../data/platform/types';
import { Button } from '../../ui/Button';

interface StudentNotificationsViewProps {
  student: Student;
  notifications: PlacementNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (route: string) => void;
}

export const StudentNotificationsView: React.FC<StudentNotificationsViewProps> = ({
  student,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredNotifications = notifications.filter((n) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'UNREAD') return !n.isRead;
    return n.category === selectedCategory;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'PLACEMENT':
        return { label: 'Placement', style: 'bg-gold/15 text-gold border-gold/30' };
      case 'APPLICATION':
        return { label: 'Application', style: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'ASSESSMENT':
      case 'INTERVIEW':
        return { label: 'Interview/Test', style: 'bg-sky-500/15 text-sky-300 border-sky-500/30' };
      case 'ANNOUNCEMENT':
        return { label: 'Announcement', style: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'SYSTEM':
      default:
        return { label: 'System', style: 'bg-white/10 text-white border-white/20' };
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
                CAMPUS BROADCASTS & ALERTS
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Shared Platform Dispatch
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
              Notifications Center
            </h1>
            <p className="text-xs sm:text-sm text-rvu-muted max-w-2xl leading-relaxed mt-1">
              Live updates generated from recruiter stage progression, CAR official announcements, and drive scheduling events for {student.name} ({student.id}).
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onMarkAllRead}
            icon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All as Read
          </Button>
        </div>

        {/* Filter Categories */}
        <div className="pt-3 border-t border-white/5 flex items-center gap-2 overflow-x-auto">
          {[
            { key: 'ALL', label: 'All Notifications' },
            { key: 'UNREAD', label: 'Unread Only' },
            { key: 'PLACEMENT', label: 'Placement' },
            { key: 'APPLICATION', label: 'Application' },
            { key: 'ANNOUNCEMENT', label: 'Announcements' },
            { key: 'SYSTEM', label: 'System' }
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-gold text-navy-dark font-bold'
                  : 'bg-[#0E1720] text-rvu-muted hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-navy-card border border-white/10 text-rvu-muted space-y-2">
          <Bell className="w-8 h-8 text-rvu-subtle mx-auto" />
          <p className="text-sm">No notifications found for this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const badge = getCategoryBadge(notif.category);

            return (
              <div
                key={notif.id}
                onClick={() => onMarkRead(notif.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  notif.isRead
                    ? 'bg-navy-card/80 border-gold-border/30 hover:border-gold/50'
                    : 'bg-[#152434] border-gold/60 shadow-card hover:border-gold'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                    notif.isRead ? 'bg-white/20' : 'bg-gold animate-pulse'
                  }`} />

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded border font-bold uppercase ${badge.style}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-mono text-rvu-subtle">
                        Origin: {notif.origin}
                      </span>
                      <span className="text-[10px] font-mono text-rvu-subtle">
                        • {notif.timestamp}
                      </span>
                    </div>

                    <h3 className={`text-sm font-bold ${notif.isRead ? 'text-white' : 'text-gold-light'}`}>
                      {notif.title}
                    </h3>

                    <p className="text-xs text-rvu-muted leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>

                {notif.actionRoute && (
                  <div className="sm:text-right shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkRead(notif.id);
                        onNavigate(notif.actionRoute!);
                      }}
                      className="text-xs py-1 px-3"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
