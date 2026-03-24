import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/patients', icon: Users, label: 'Patients' },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-sidebar-bg flex flex-col transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto border-r border-sand/50 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3.5 px-6 h-[72px] shrink-0">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center shadow-[var(--glow-emerald)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 4v16M4 12h16" />
            </svg>
            {/* Spinning ring */}
            <div className="absolute -inset-[3px] rounded-xl border border-emerald-400/20 animate-[border-glow_3s_ease-in-out_infinite]" />
          </div>
          <div>
            <span className="text-[15px] font-extrabold tracking-tight text-ink" style={{ fontFamily: "'Playfair Display', serif" }}>
              Med<span className="text-gradient">Connect</span>
            </span>
            <p className="text-[10px] font-medium text-ink-faint tracking-wide uppercase mt-[-1px]">Healthcare Platform</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-sand/60 transition-colors"
          >
            <X className="w-4 h-4 text-ink-muted" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-faint px-3 mb-3">
            Navigation
          </p>
          {links.map(({ to, icon: Icon, label }, i) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 animate-slide-right ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-ink-muted hover:text-ink'
                }`
              }
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {({ isActive }) => (
                <>
                  {/* Active background with glow */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-emerald-500/[0.08] dark:bg-emerald-500/[0.06] border border-emerald-500/20 shadow-[var(--glow-emerald)]" />
                  )}
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  )}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_2px_8px_rgba(16,185,129,0.35)]'
                        : 'bg-sand/40 group-hover:bg-sand/80'
                    }`}
                  >
                    <Icon className={`w-[15px] h-[15px] transition-colors duration-300 ${isActive ? 'text-white' : 'text-ink-faint group-hover:text-ink-muted'}`} />
                  </div>
                  <span className="relative z-10">{label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Promo Card */}
          <div className="mt-6 mx-1 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent border border-emerald-500/10 relative overflow-hidden">
            <div className="orb w-24 h-24 bg-emerald-400 -top-8 -right-8" />
            <Sparkles className="w-5 h-5 text-emerald-500 mb-2" />
            <p className="text-[12px] font-bold text-ink relative z-10">Smart Insights</p>
            <p className="text-[11px] text-ink-muted mt-1 leading-relaxed relative z-10">
              AI-powered patient analytics available
            </p>
          </div>
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-sand/40">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-ink-muted hover:text-danger hover:bg-danger/5 w-full transition-all duration-300 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sand/40 group-hover:bg-danger/10 transition-colors">
              <LogOut className="w-[15px] h-[15px] group-hover:text-danger transition-colors" />
            </div>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
