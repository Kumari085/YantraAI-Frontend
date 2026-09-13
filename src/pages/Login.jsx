import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS } from '../services/auth.api';
import { Shield, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/';

  // If already logged in, redirect immediately
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please provide both email address and authorization key.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Authentication rejected. Verify sovereign credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (accountType) => {
    const acc = DEMO_ACCOUNTS[accountType];
    if (acc) {
      setEmail(acc.email);
      setPassword(acc.password);
      setErrorMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col justify-between select-none relative overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Indicator */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-900 z-10">
        <div className="flex items-center gap-2.5 font-mono text-xs text-slate-400">
          <Shield size={16} className="text-sky-400" />
          <span className="font-semibold text-slate-200">YantraAI</span>
          <span className="text-slate-600">/</span>
          <span>Sovereign Perimeter Access</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] bg-[#0c1018] px-3 py-1 rounded-full border border-slate-800 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>AIRGAP CONTAINMENT ENFORCED</span>
        </div>
      </header>

      {/* Center Login Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-[#0b0e15] border border-slate-800/90 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Logo & Subtitle */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-sky-950 to-[#0c1018] border border-sky-500/40 text-sky-400 shadow-glow-cyan mb-2">
              <Shield size={28} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              YANTRA AI WORKBENCH
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Industrial sovereign workstation. Log in to establish an authorized local session.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle size={15} className="flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">
                Operator Email / Identifier
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@aegis.local"
                  required
                  autoFocus
                  className="w-full bg-[#07090f] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">
                Sovereign Passphrase / Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#07090f] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition-all font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="xs" />
                  <span>Authorizing Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Sovereign Node</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Demo Simulation Credentials Box (Fast-Fill) */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles size={12} className="text-amber-400" />
                <span>Demo Simulation Mode</span>
              </span>
              <span>One-Click Populate</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="p-2.5 rounded-lg bg-[#0e131d] hover:bg-[#151c29] border border-slate-800 text-left transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sky-300 font-semibold group-hover:text-sky-200">
                    Administrator
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400">
                    Admin
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">admin@aegis.local</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('operator')}
                className="p-2.5 rounded-lg bg-[#0e131d] hover:bg-[#151c29] border border-slate-800 text-left transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 font-semibold group-hover:text-emerald-200">
                    Standard User
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400">
                    User
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">operator@aegis.local</div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-slate-900 text-center font-mono text-[11px] text-slate-600 flex items-center justify-between z-10">
        <span>YantraAI Sovereign Micro-Kernel v1.0</span>
        <span>Zero Cloud Dependency // On-Premises Execution Only</span>
      </footer>
    </div>
  );
};

export default Login;
