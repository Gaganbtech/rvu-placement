import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { GraduationCap, ArrowRight, UserCheck } from 'lucide-react';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  onNavigateLogin?: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  onNavigateLogin
}) => {
  const handleGoToLogin = () => {
    onClose();
    if (onNavigateLogin) {
      onNavigateLogin();
    } else if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', '/login?role=student');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } catch {
        window.location.hash = '/login?role=student';
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Placement Portal"
      subtitle="Sign in with your student credentials to continue."
      maxWidth="md"
    >
      <div className="space-y-4 py-2">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-navy-surface border border-gold-border/60 text-xs text-rvu-muted">
          <GraduationCap className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">Student Workspace Login</span>
            <span>
              Sign in with your User ID / student email and password to access opportunities, applications, and placement preparation.
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#101A22] border border-white/5 text-xs text-rvu-muted space-y-2">
          <p>
            You can use your RVU student email (e.g. <code>student@rvu.edu.in</code>) or registered User ID.
          </p>
          <div className="flex items-center gap-2 text-gold font-mono text-[11px]">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Secure Student Workspace Authentication</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gold-border flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={handleGoToLogin}
          >
            Go to Student Login
          </Button>
        </div>
      </div>
    </Modal>
  );
};
