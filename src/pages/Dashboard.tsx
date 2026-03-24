import { Users, AlertTriangle, TrendingUp, CalendarCheck, Bell, ArrowUpRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/StatCard';
import { usePatientStore } from '../store/patientStore';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import { useChartTheme } from '../hooks/useChartTheme';

const weeklyData = [
  { day: 'Mon', admissions: 12, discharges: 8 },
  { day: 'Tue', admissions: 18, discharges: 14 },
  { day: 'Wed', admissions: 15, discharges: 12 },
  { day: 'Thu', admissions: 22, discharges: 16 },
  { day: 'Fri', admissions: 19, discharges: 20 },
  { day: 'Sat', admissions: 10, discharges: 9 },
  { day: 'Sun', admissions: 8, discharges: 7 },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const patients = usePatientStore((s) => s.patients);
  const user = useAuthStore((s) => s.user);
  const notifications = useNotificationStore((s) => s.notifications);
  const sendBrowserNotification = useNotificationStore((s) => s.sendBrowserNotification);
  const requestPermission = useNotificationStore((s) => s.requestPermission);
  const permission = useNotificationStore((s) => s.permission);
  const chart = useChartTheme();

  const critical = patients.filter((p) => p.status === 'Critical').length;
  const stable = patients.filter((p) => p.status === 'Stable').length;
  const recovering = patients.filter((p) => p.status === 'Recovering').length;

  const handleTestNotification = async () => {
    if (permission === 'default') await requestPermission();
    sendBrowserNotification(
      'New Appointment Scheduled',
      'Dr. Emily Chen has a new appointment with patient Sarah Johnson at 3:00 PM.',
    );
  };

  const dotColor: Record<string, string> = {
    error: 'bg-danger',
    warning: 'bg-warning',
    success: 'bg-emerald-500',
    info: 'bg-info',
  };

  const firstName = user?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Doctor';

  return (
    <div className="space-y-8">
      {/* Greeting header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400 mb-1">
            {getGreeting()}
          </p>
          <h1
            className="text-[32px] sm:text-[38px] font-bold text-ink tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {firstName}'s Dashboard
          </h1>
          <p className="text-[14px] text-ink-muted mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={handleTestNotification}
          className="self-start flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold tracking-wide uppercase rounded-xl transition-all duration-300 hover:-translate-y-px shadow-[var(--glow-emerald)] hover:shadow-[var(--glow-emerald-strong)] active:translate-y-0 cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5" />
          Test Notification
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger">
        <StatCard
          label="Total Patients"
          value={patients.length}
          change="12%"
          positive
          icon={<Users className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-500/10"
          accentColor="emerald"
        />
        <StatCard
          label="Critical Cases"
          value={critical}
          change="2 new"
          positive={false}
          icon={<AlertTriangle className="w-5 h-5 text-danger" />}
          iconBg="bg-danger/10"
          accentColor="danger"
        />
        <StatCard
          label="Recovering"
          value={recovering}
          change="8%"
          positive
          icon={<TrendingUp className="w-5 h-5 text-info" />}
          iconBg="bg-info/10"
          accentColor="info"
        />
        <StatCard
          label="Stable"
          value={stable}
          icon={<CalendarCheck className="w-5 h-5 text-warning" />}
          iconBg="bg-warning/10"
          accentColor="warning"
        />
      </div>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="xl:col-span-2 bg-card rounded-2xl border border-sand/40 p-6 shadow-[var(--shadow-card)] transition-all duration-500 hover:shadow-[var(--shadow-card-hover)] animate-fade-up relative overflow-hidden" style={{ animationDelay: '300ms' }}>
          {/* Subtle ambient glow */}
          <div className="orb w-40 h-40 bg-emerald-400/20 -top-20 right-10" />

          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2
              className="text-[18px] font-bold text-ink"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Patient Flow
            </h2>
            <div className="flex items-center gap-5 text-[11px] font-bold text-ink-faint">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Admissions
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-info" />
                Discharges
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="disGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: chart.tick, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: chart.tick, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chart.tooltip} />
              <Area type="monotone" dataKey="admissions" stroke="#10b981" fill="url(#admGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: chart.dark ? '#141418' : '#fff' }} />
              <Area type="monotone" dataKey="discharges" stroke="#6366F1" fill="url(#disGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: chart.dark ? '#141418' : '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Alerts */}
        <div className="bg-card rounded-2xl border border-sand/40 p-6 shadow-[var(--shadow-card)] flex flex-col animate-fade-up overflow-hidden relative" style={{ animationDelay: '400ms' }}>
          <div className="orb w-32 h-32 bg-danger/10 -top-10 -right-10" />

          <div className="flex items-center justify-between mb-5 relative z-10">
            <h2
              className="text-[18px] font-bold text-ink"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Recent Alerts
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wide text-ink-faint flex items-center gap-1 cursor-pointer hover:text-emerald-600 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>

          <div className="flex-1 space-y-0.5 overflow-y-auto relative z-10">
            {notifications.slice(0, 5).map((n, i) => (
              <div
                key={n.id}
                className="flex gap-3 items-start p-3 rounded-xl hover:bg-sand/30 transition-all duration-200 cursor-pointer group animate-fade-up"
                style={{ animationDelay: `${450 + i * 60}ms` }}
              >
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dotColor[n.type]}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-ink truncate group-hover:text-emerald-600 transition-colors">
                    {n.title}
                  </p>
                  <p className="text-[11px] text-ink-faint truncate mt-0.5">
                    {n.message}
                  </p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
