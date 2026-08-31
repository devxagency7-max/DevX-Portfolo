import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { Lock, X, Mail, KeyRound, ShieldAlert } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await authService.login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setError(false);
      setEmail('');
      setPassword('');
      onSuccess();
    } else {
      setError(true);
      setErrorMessage(result.error || 'Login failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md p-8 rounded-3xl shadow-2xl flex flex-col gap-6 transition-all border"
        style={{
          background: 'var(--bg-card, #0F0F12)',
          borderColor: 'var(--border-strong, rgba(255, 255, 255, 0.12))',
          boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15)',
          color: 'var(--text-main, #FFFFFF)'
        }}
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-6 right-6 p-2 rounded-xl text-[var(--text-muted,#A1A1AA)] hover:text-[var(--text-main,#FFFFFF)] hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              color: '#6366F1'
            }}
          >
            <Lock className="w-8 h-8 text-[#6366F1]" />
          </div>

          <div>
            <h2 className="font-display font-extrabold text-2xl tracking-tight text-[var(--text-main,#FFFFFF)]">
              CMS Admin Authentication
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted,#A1A1AA)] mt-1.5 tracking-wider uppercase">
              Dev Smart X Restricted Management Panel
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          
          {/* Email Field */}
          <div>
            <label className="font-mono text-[11px] font-semibold tracking-wider text-[var(--text-muted,#A1A1AA)] uppercase mb-1.5 block">
              EMAIL ADDRESS
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[var(--text-dim,#71717A)] absolute left-4 pointer-events-none" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={e => { setEmail(e.target.value); setError(false); }}
                placeholder="admin@devsmartx.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl font-mono text-sm outline-none transition-all border"
                style={{
                  background: 'var(--bg-secondary, #14141B)',
                  borderColor: 'var(--border-hairline, rgba(255, 255, 255, 0.12))',
                  color: 'var(--text-main, #FFFFFF)'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="font-mono text-[11px] font-semibold tracking-wider text-[var(--text-muted,#A1A1AA)] uppercase mb-1.5 block">
              PASSWORD
            </label>
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-[var(--text-dim,#71717A)] absolute left-4 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl font-mono text-sm tracking-widest outline-none transition-all border"
                style={{
                  background: 'var(--bg-secondary, #14141B)',
                  borderColor: 'var(--border-hairline, rgba(255, 255, 255, 0.12))',
                  color: 'var(--text-main, #FFFFFF)'
                }}
              />
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div
              className="p-3.5 rounded-xl text-xs font-mono flex items-center gap-2.5"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444'
              }}
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl font-mono text-xs font-bold tracking-widest uppercase text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5548E0] hover:to-[#7C3AED] shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? 'AUTHENTICATING SESSION…' : 'AUTHENTICATE SESSION'}
          </button>
        </form>

      </div>
    </div>
  );
};
