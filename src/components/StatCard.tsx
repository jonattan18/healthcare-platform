import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: ReactNode;
  iconBg: string;
  accentColor?: string;
}

export default function StatCard({
  label,
  value,
  change,
  positive,
  icon,
  iconBg,
  accentColor = 'emerald',
}: StatCardProps) {
  return (
    <div className="group relative bg-card rounded-2xl border border-sand/40 p-5 transition-all duration-500 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 overflow-hidden">
      {/* Ambient glow on hover */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl ${
          accentColor === 'emerald'
            ? 'bg-emerald-400/10'
            : accentColor === 'danger'
              ? 'bg-danger/10'
              : accentColor === 'info'
                ? 'bg-info/10'
                : 'bg-warning/10'
        }`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
          >
            {icon}
          </div>
          {change && (
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                positive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-danger/10 text-danger'
              }`}
            >
              {positive ? '↑' : '↓'} {change}
            </span>
          )}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-faint mb-1">{label}</p>
        <p
          className="text-[32px] font-extrabold text-ink tracking-tight leading-none animate-[counter_0.5s_ease_both]"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
