/**
 * components/layout/AppLayout.jsx
 * Main authenticated app shell — sidebar + topbar + content area
 * Dark theme: #1a1a2e background, #e94560 accent
 */

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Briefcase, Zap, FolderOpen,
  ClipboardList, Bot, User, Settings, LogOut, Menu, X,
  Bell, ChevronDown, Shield,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/resume',       icon: FileText,        label: 'Resume'       },
  { to: '/jobs',         icon: Briefcase,       label: 'Jobs'         },
  { to: '/skills',       icon: Zap,             label: 'Skills'       },
  { to: '/projects',     icon: FolderOpen,      label: 'Projects'     },
  { to: '/applications', icon: ClipboardList,   label: 'Applications' },
  { to: '/ai-mentor',    icon: Bot,             label: 'AI Mentor'    },
];

const ROLE_BADGE = {
  student: { label: 'Student', color: '#3b82f6' },
  faculty: { label: 'Faculty', color: '#8b5cf6' },
  admin:   { label: 'Admin',   color: '#e94560' },
};

export default function AppLayout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebar] = useState(true);
  const [mobileOpen,  setMobile]  = useState(false);

  const badge = ROLE_BADGE[role] || ROLE_BADGE.student;

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm text-white"
            style={{ background: '#e94560' }}>A</div>
          {sidebarOpen && (
            <div>
              <p className="font-black text-sm text-white tracking-wide">AKIRO</p>
              <p className="text-[9px] text-white/25 font-medium tracking-widest">AI CAREER</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to}
            onClick={() => setMobile(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               transition-all duration-150 group
               ${isActive
                 ? 'bg-[#e94560]/15 text-[#e94560]'
                 : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-[#e94560]' : 'text-current'} />
                {sidebarOpen && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-white/5 p-3 flex-shrink-0">
        {/* Settings */}
        <NavLink to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40
            hover:text-white/80 hover:bg-white/5 transition-all mb-1">
          <Settings size={17} />
          {sidebarOpen && <span>Settings</span>}
        </NavLink>

        {/* User card */}
        {sidebarOpen ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3 border border-white/6">
            <Avatar name={user?.name} size={8} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: `${badge.color}20`, color: badge.color }}>
                  {badge.label}
                </span>
              </div>
            </div>
            <button onClick={handleLogout}
              className="text-white/25 hover:text-[#e94560] transition-colors p-1 rounded-lg hover:bg-[#e94560]/10">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center p-2.5 text-white/30
              hover:text-[#e94560] hover:bg-[#e94560]/10 rounded-xl transition-all">
            <LogOut size={17} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#1a1a2e' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col border-r border-white/5 transition-all duration-300 flex-shrink-0"
        style={{
          width: sidebarOpen ? 220 : 64,
          background: '#16213e',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobile(false)} />
          <aside className="relative w-64 flex flex-col border-r border-white/5 z-10"
            style={{ background: '#16213e' }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex items-center px-5 gap-4 border-b border-white/5 flex-shrink-0"
          style={{ background: '#16213e' }}>
          {/* Desktop collapse toggle */}
          <button onClick={() => setSidebar((v) => !v)}
            className="hidden lg:flex p-2 rounded-xl text-white/30 hover:text-white/70
              hover:bg-white/5 transition-all">
            <Menu size={18} />
          </button>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobile((v) => !v)}
            className="lg:hidden p-2 rounded-xl text-white/30 hover:text-white/70
              hover:bg-white/5 transition-all">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex-1" />

          {/* MFA badge */}
          {user?.mfaEnabled && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: '#10b98115', color: '#10b981' }}>
              <Shield size={12} />
              MFA Active
            </div>
          )}

          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-white/30 hover:text-white/70
            hover:bg-white/5 transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e94560]" />
          </button>

          {/* User pill */}
          <button onClick={() => navigate('/profile')}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5
              transition-all border border-white/6">
            <Avatar name={user?.name} size={7} />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">{user?.name?.split(' ')[0]}</p>
              <p className="text-[10px] mt-0.5 font-bold" style={{ color: badge.color }}>{badge.label}</p>
            </div>
            <ChevronDown size={14} className="text-white/25 hidden sm:block" />
          </button>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Avatar({ name, size = 8 }) {
  const initials = name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'U';
  return (
    <div
      className={`w-${size} h-${size} rounded-lg flex items-center justify-center
        text-xs font-bold text-white flex-shrink-0`}
      style={{ background: '#e94560' }}
    >
      {initials}
    </div>
  );
}
