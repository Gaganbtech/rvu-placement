import React from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';

interface SignOutConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userEmail?: string;
}

export const SignOutConfirmDialog: React.FC<SignOutConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  userEmail
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-[#20303A] border border-[#CCAA68]/40 rounded-2xl p-6 shadow-2xl text-white space-y-5 animate-in zoom-in-95 duration-150">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Sign Out Confirmation
            </h3>
            <p className="text-xs text-[#AEB7BC]">
              Are you sure you want to sign out?
            </p>
          </div>
        </div>

        {userEmail && (
          <div className="p-2.5 rounded-xl bg-[#101A22] border border-white/5 text-[11px] font-mono text-[#AEB7BC]">
            Active session: <span className="text-white">{userEmail}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-amber-300/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>You will need to sign in again to access your career workspace.</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-3 rounded-xl bg-[#101A22] hover:bg-[#19252F] text-xs font-semibold text-[#AEB7BC] hover:text-white border border-white/10 transition-colors text-center"
          >
            CANCEL
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors shadow-lg shadow-rose-900/40 text-center"
          >
            SIGN OUT
          </button>
        </div>

      </div>
    </div>
  );
};
