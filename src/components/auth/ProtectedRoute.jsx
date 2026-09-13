import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080a0e] flex flex-col items-center justify-center space-y-3 text-slate-400 font-mono text-xs">
        <LoadingSpinner size="lg" />
        <span className="text-sky-400 animate-pulse">Verifying sovereign security credentials...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // RBAC Role check
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 font-mono">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-glow-rose">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100 uppercase tracking-wide">
            Access Restricted // 403 Forbidden
          </h2>
          <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed font-sans">
            Your current security classification (<strong className="text-slate-200 uppercase">{user?.role}</strong>) does not have authorization to view this administrative resource.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Workspace</span>
        </Link>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
