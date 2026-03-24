import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { usePatientStore } from '../store/patientStore';
import { useChartTheme } from '../hooks/useChartTheme';

const monthlyData = [
  { month: 'Oct', patients: 180 },
  { month: 'Nov', patients: 210 },
  { month: 'Dec', patients: 195 },
  { month: 'Jan', patients: 240 },
  { month: 'Feb', patients: 260 },
  { month: 'Mar', patients: 285 },
];

const departmentData = [
  { name: 'Cardiology', value: 28 },
  { name: 'Neurology', value: 18 },
  { name: 'Orthopedics', value: 15 },
  { name: 'Pulmonology', value: 22 },
  { name: 'Others', value: 17 },
];

const satisfactionData = [
  { month: 'Oct', score: 4.1 },
  { month: 'Nov', score: 4.3 },
  { month: 'Dec', score: 4.2 },
  { month: 'Jan', score: 4.5 },
  { month: 'Feb', score: 4.6 },
  { month: 'Mar', score: 4.7 },
];

function ChartCard({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="bg-card rounded-2xl border border-sand/40 p-6 shadow-[var(--shadow-card)] transition-all duration-500 hover:shadow-[var(--shadow-card-hover)] animate-fade-up overflow-hidden relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2
        className="text-[18px] font-bold text-ink mb-5 relative z-10"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h2>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function Analytics() {
  const patients = usePatientStore((s) => s.patients);
  const chart = useChartTheme();

  const axisProps = {
    tick: { fontSize: 11, fill: chart.tick, fontWeight: 600 } as const,
    axisLine: false as const,
    tickLine: false as const,
  };

  const statusCounts = patients.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const statusColors: Record<string, string> = {
    Stable: chart.colors.indigo,
    Critical: chart.colors.rose,
    Recovering: chart.colors.emerald,
    Discharged: chart.colors.slate,
  };

  const DEPT_COLORS = [chart.colors.emerald, chart.colors.indigo, chart.colors.amber, chart.colors.sky, chart.colors.slate];

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400 mb-1">
          Insights
        </p>
        <h1
          className="text-[32px] sm:text-[38px] font-bold text-ink tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Analytics
        </h1>
        <p className="text-[14px] text-ink-muted mt-1">
          Performance metrics and trends across departments
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Monthly volume */}
        <ChartCard title="Monthly Patient Volume" delay={100}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={chart.tooltip} cursor={{ fill: chart.dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }} />
              <Bar dataKey="patients" fill="url(#barGrad)" radius={[8, 8, 2, 2]} name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department distribution */}
        <ChartCard title="Department Distribution" delay={200}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                dataKey="value"
                strokeWidth={4}
                stroke={chart.pieStroke}
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {departmentData.map((_, i) => (
                  <Cell key={i} fill={DEPT_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chart.tooltip} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Patient status */}
        <ChartCard title="Patient Status" delay={300}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={110} dataKey="value" strokeWidth={4} stroke={chart.pieStroke}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={statusColors[entry.name] || DEPT_COLORS[i % DEPT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chart.tooltip} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: 'Manrope, sans-serif', fontWeight: 600 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Satisfaction */}
        <ChartCard title="Patient Satisfaction" delay={400}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={satisfactionData}>
              <defs>
                <linearGradient id="satGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis domain={[3.5, 5]} {...axisProps} />
              <Tooltip contentStyle={chart.tooltip} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366F1"
                strokeWidth={2.5}
                dot={{ r: 5, fill: '#6366F1', strokeWidth: 3, stroke: chart.dark ? '#141418' : '#fff' }}
                activeDot={{ r: 7, strokeWidth: 3, stroke: chart.dark ? '#141418' : '#fff' }}
                name="Score (out of 5)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
