/**
 * hooks/useAuth.js
 * Custom hook — exposes auth state + helpers across the app
 */

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation, useRefreshMutation } from '../features/auth/authApi';
import {
  selectCurrentUser,
  selectAccessToken,
  selectIsAuthed,
  selectInitialised,
  selectMfaPending,
  selectRole,
  setCredentials,
  clearAuth,
} from '../features/auth/authSlice';

export function useAuth() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const user        = useSelector(selectCurrentUser);
  const token       = useSelector(selectAccessToken);
  const isAuthed    = useSelector(selectIsAuthed);
  const initialised = useSelector(selectInitialised);
  const mfaPending  = useSelector(selectMfaPending);
  const role        = useSelector(selectRole);

  const [logoutMutation]   = useLogoutMutation();
  const [refreshMutation]  = useRefreshMutation();

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch { /* ignore */ }
    dispatch(clearAuth());
    navigate('/login');
  };

  // ── Silent token refresh ────────────────────────────────────────────────────
  const refreshToken = async () => {
    try {
      const result = await refreshMutation().unwrap();
      dispatch(setCredentials({ accessToken: result.accessToken, user: result.user }));
      return result.accessToken;
    } catch {
      dispatch(clearAuth());
      navigate('/login');
      return null;
    }
  };

  // ── Role helpers ────────────────────────────────────────────────────────────
  const isStudent = role === 'student';
  const isFaculty = role === 'faculty';
  const isAdmin   = role === 'admin';
  const isStaff   = isFaculty || isAdmin;

  return {
    user,
    token,
    isAuthed,
    initialised,
    mfaPending,
    role,
    isStudent,
    isFaculty,
    isAdmin,
    isStaff,
    logout,
    refreshToken,
  };
}
