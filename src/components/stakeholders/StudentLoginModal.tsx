import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldCheck, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    if (onLoginSuccess) {
      setTimeout(() => {
        setIsLoggedIn(false);
        onClose();
        onLoginSuccess();
      }, 500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsLoggedIn(false);
        onClose();
      }}
      title="Student Placement Portal"
      subtitle="Sign in with your official @rvu.edu.in student credentials."
      maxWidth="md"
    >
      {isLoggedIn ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-rvu-text">
            Welcome to RVU Career Hub
          </h4>
          <p className="text-xs text-rvu-muted max-w-xs mx-auto">
            Authenticated via RV University Single Sign-On (SSO). Redirecting to your personal career dashboard...
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsLoggedIn(false);
                onClose();
              }}
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Institutional Note */}
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-navy-surface border border-gold-border/60 text-xs text-rvu-muted">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
            <span>Authorized access only for active enrolled students and verified alumni.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rvu-text uppercase tracking-wider mb-1">
              RVU Student Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student.name@rvu.edu.in"
                className="w-full bg-navy-surface border border-gold/30 rounded-xl pl-9 pr-3 py-2 text-xs text-rvu-text focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rvu-text uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-navy-surface border border-gold/30 rounded-xl pl-9 pr-3 py-2 text-xs text-rvu-text focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-1.5 text-rvu-muted cursor-pointer">
              <input type="checkbox" className="rounded bg-navy-surface border-gold/30 text-gold focus:ring-0" />
              <span>Remember this session</span>
            </label>
            <a href="#" className="text-gold hover:underline">Forgot password?</a>
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
              type="submit"
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Sign In to Career Hub
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
