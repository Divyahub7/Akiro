/**
 * components/layout/ProtectedRoute.jsx
 * Route guard — redirects unauthenticated users to /login
 * Supports role-based restriction via the `roles` prop
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectIsAuthed,
  selectInitialised,
  selectRole,
} from '../../features/auth/authSlice';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, roles }) {
  const isAuthed    = useSelector(selectIsAuthed);
  const initialised = useSelector(selectInitialised);
  const role        = useSelector(selectRole);
  const location    = useLocation();

  // Still bootstrapping auth state (checking refresh token / cookie)
  if (!initialised) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1a2e' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xl"
            style={{ background: '#e94560' }}>A</div>
          <Loader2 size={20} className="animate-spin text-[#e94560]" />
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based guard
  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

/**
 * PublicRoute — redirects authenticated users away from auth pages
 */
export function PublicRoute({ children }) {
  const isAuthed    = useSelector(selectIsAuthed);
  const initialised = useSelector(selectInitialised);

  if (!initialised) return null;
  if (isAuthed) return <Navigate to="/dashboard" replace />;
  return children;
}
