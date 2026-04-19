/**
 * pages/OAuth/OAuthCallback.jsx
 * Handles the redirect from OAuth — reads token from URL, stores in Redux,
 * then redirects to dashboard.
 */

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { authApi } from '../../features/auth/authApi';
import { Loader2 } from 'lucide-react';

export default function OAuthCallback() {
  const [params]  = useSearchParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      navigate('/login?error=oauth_failed', { replace: true });
      return;
    }

    // Store access token in Redux
    dispatch(setCredentials({ accessToken: token }));

    // Fetch the user profile using the new token
    dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }))
      .unwrap()
      .then((data) => {
        dispatch(setCredentials({ accessToken: token, user: data.user }));
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        navigate('/login?error=oauth_failed', { replace: true });
      });
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: '#1a1a2e' }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xl"
        style={{ background: '#e94560' }}>A</div>
      <div className="flex items-center gap-2 text-white/50 text-sm">
        <Loader2 size={16} className="animate-spin text-[#e94560]" />
        Completing sign-in…
      </div>
    </div>
  );
}
