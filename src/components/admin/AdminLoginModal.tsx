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
    <div className="modal-overlay animate-fadeIn">
      <div
        className="relative w-full max-w-md p-8 rounded-3xl shadow-2xl flex flex-col gap-6"
        style={{
          background: '#0C0C10',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 60px rgba(99, 102, 241, 0.2)',
          color: '#F0F0F5'
        }}
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center gap-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#6366F1'
            }}
          >
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-white">CMS Admin Authentication</h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Dev Smart X Restricted Management Panel
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="form-label font-mono text-xs text-zinc-300">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={e => { setEmail(e.target.value); setError(false); }}
                placeholder="admin@devsmartx.com"
                className="form-input pl-10 text-sm font-mono"
                style={{
                  background: '#13131A',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#F0F0F5'
                }}
              />
            </div>
          </div>

          <div>
            <label className="form-label font-mono text-xs text-zinc-300">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                placeholder="••••••••••••"
                className="form-input pl-10 text-sm tracking-widest font-mono"
                style={{
                  background: '#13131A',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#F0F0F5'
                }}
              />
            </div>
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-xs font-mono flex items-center gap-2"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444'
              }}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="editorial-btn w-full justify-center py-3 text-sm mt-2 disabled:opacity-60"
          >
            {isSubmitting ? 'Authenticating…' : 'Authenticate Session'}
          </button>
        </form>

      </div>
    </div>
  );
};
