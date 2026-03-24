import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Check, X, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { useThemeStore } from '../store/themeStore';

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const user = useAuthStore((s) => s.user);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } =
    useNotificationStore();
  const { dark, toggle: toggleTheme } = useThemeStore();

  const [showNotifs, setShowNotifs] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const count = unreadCount();

  const typeColor = {
    error: { bg: 'bg-danger/10', text: 'text-danger', dot: 'bg-danger' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
    success: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500' },
    info: { bg: 'bg-info/10', text: 'text-info', dot: 'bg-info' },
  };

  return (
    <header className="h-[72px] glass border-b border-sand/40 flex items-center px-4 sm:px-6 gap-3 shrink-0 sticky top-0 z-30 transition-colors duration-300">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2.5 rounded-xl hover:bg-sand/50 transition-colors"
      >
        <Menu className="w-5 h-5 text-ink-muted" />
      </button>

      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="relative p-2.5 rounded-xl hover:bg-sand/50 transition-all duration-300 cursor-pointer group"
        title={dark ? 'Light mode' : 'Dark mode'}
      >
        <div className="relative w-[18px] h-[18px]">
          <Sun
            className={`absolute inset-0 w-[18px] h-[18px] text-amber-500 transition-all duration-300 ${
              dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
            }`}
          />
          <Moon
            className={`absolute inset-0 w-[18px] h-[18px] text-ink-muted group-hover:text-ink transition-all duration-300 ${
              dark ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
        </div>
      </button>

      {/* Notifications */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setShowNotifs(!showNotifs)}
          className="relative p-2.5 rounded-xl hover:bg-sand/50 transition-all duration-200 cursor-pointer group"
        >
          <Bell className="w-[18px] h-[18px] text-ink-muted group-hover:text-ink transition-colors" />
          {count > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center">
              <span className="absolute w-[18px] h-[18px] rounded-full bg-danger/30 animate-ping" />
              <span className="relative w-[18px] h-[18px] bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            </span>
          )}
        </button>

        {showNotifs && (
          <div className="absolute right-0 top-14 w-[360px] sm:w-[420px] bg-card rounded-2xl border border-sand/60 z-50 overflow-hidden animate-scale-in shadow-[var(--shadow-card-hover)]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-sand/40">
              <h3 className="text-sm font-bold text-ink" style={{ fontFamily: "'Playfair Display', serif" }}>
                Notifications
              </h3>
              {count > 0 && (
                <button onClick={markAllAsRead} className="text-[11px] text-emerald-600 font-semibold hover:underline cursor-pointer">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[380px] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-ink-faint p-8 text-center">No notifications yet</p>
              ) : (
                notifications.map((n, i) => (
                  <div
                    key={n.id}
                    className={`px-5 py-4 flex gap-3 items-start border-b border-sand/20 last:border-0 transition-all duration-200 animate-fade-up ${
                      !n.read ? 'bg-emerald-500/[0.03]' : 'hover:bg-sand/20'
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-transparent' : typeColor[n.type].dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md ${typeColor[n.type].bg} ${typeColor[n.type].text}`}>
                          {n.type}
                        </span>
                        <span className="text-[10px] text-ink-faint">{timeAgo(n.timestamp)}</span>
                      </div>
                      <p className="text-[13px] font-semibold text-ink">{n.title}</p>
                      <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-1">{n.message}</p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {!n.read && (
                        <button onClick={() => markAsRead(n.id)} className="p-1.5 rounded-lg hover:bg-sand/50 cursor-pointer transition-colors" title="Mark as read">
                          <Check className="w-3 h-3 text-ink-faint" />
                        </button>
                      )}
                      <button onClick={() => removeNotification(n.id)} className="p-1.5 rounded-lg hover:bg-danger/10 cursor-pointer transition-colors" title="Dismiss">
                        <X className="w-3 h-3 text-ink-faint" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User */}
      <div className="flex items-center gap-3 pl-3 ml-1 border-l border-sand/40">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-[13px] font-bold shadow-[var(--glow-emerald)]">
            {user?.displayName?.charAt(0).toUpperCase() ?? user?.email?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
        </div>
        <div className="hidden sm:block">
          <p className="text-[13px] font-bold text-ink leading-none">{user?.displayName ?? user?.email?.split('@')[0] ?? 'User'}</p>
          <p className="text-[10px] text-ink-faint mt-0.5">{user?.email ?? ''}</p>
        </div>
      </div>
    </header>
  );
}
