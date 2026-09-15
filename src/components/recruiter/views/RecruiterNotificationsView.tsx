import React, { useState } from 'react';
import {
  Bell,
  ChevronRight,
  ShieldCheck,
  FileText,
  Calendar,
  Award,
  Sparkles
} from 'lucide-react';
import type { PlatformStoreState } from '../../../data/platform/studentStore';

interface RecruiterNotificationsViewProps {
  store: PlatformStoreState;
  onNavigate: (route: string) => void;
}

export const RecruiterNotificationsView: React.FC<RecruiterNotificationsViewProps> = ({
  store,
  onNavigate
}) => {
  const notifs = store.recruiterNotifications;
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = notifs.filter(n => {
    if (filterType === 'ALL') return true;
    if (filterType === 'UNREAD') return !n.isRead;
    return n.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'APPLICATION': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'ASSESSMENT': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'INTERVIEW': return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'DRIVE': return <Calendar className="w-4 h-4 text-teal-400" />;
      case 'OFFER_STATUS': return <Award className="w-4 h-4 text-emerald-400" />;
      case 'OPPORTUNITY_STATUS': return <ShieldCheck className="w-4 h-4 text-[#CCAA68]" />;
      default: return <Bell className="w-4 h-4 text-[#CCAA68]" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Recruitment Activity Notifications
          </h1>
          <p className="text-xs text-gray-400">
            Real-time status alerts across applications, CAR approvals, assessment submissions, and interviews
          </p>
        </div>

        {notifs.some(n => !n.isRead) && (
          <button
            onClick={() => store.markAllRecruiterNotificationsRead()}
            className="px-3.5 py-1.5 rounded-lg bg-[#20303A] hover:bg-[#20303A]/80 text-[#CCAA68] text-xs font-semibold border border-[#CCAA68]/30 transition-colors self-start sm:self-auto"
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {(['ALL', 'UNREAD', 'APPLICATION', 'OPPORTUNITY_STATUS', 'ASSESSMENT', 'INTERVIEW', 'DRIVE', 'OFFER_STATUS'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === tab
                ? 'bg-[#CCAA68] text-[#101A22] font-semibold'
                : 'bg-[#19252F] text-gray-300 hover:text-white border border-[#CCAA68]/20'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#19252F] border border-[#CCAA68]/20 space-y-3">
          <Bell className="w-10 h-10 text-gray-500 mx-auto" />
          <div className="text-sm font-semibold text-white">No notifications found</div>
          <p className="text-xs text-gray-400">
            You're all caught up! New student applications and CAR approvals will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                store.markRecruiterNotificationRead(notif.id);
                if (notif.actionRoute) onNavigate(notif.actionRoute);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !notif.isRead
                  ? 'bg-gradient-to-r from-[#19252F] to-[#20303A] border-[#CCAA68]/50 shadow-md'
                  : 'bg-[#19252F] border-[#CCAA68]/15 hover:border-[#CCAA68]/40'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#20303A] border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">{notif.title}</span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#CCAA68] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{notif.message}</p>
                  <div className="text-[10px] text-gray-400 font-mono pt-0.5 flex items-center gap-2">
                    <span>{notif.timestamp}</span>
                    <span>•</span>
                    <span className="text-[#CCAA68]">{notif.type.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
