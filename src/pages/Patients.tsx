import { LayoutGrid, List, Search, ArrowUpRight } from 'lucide-react';
import { usePatientStore } from '../store/patientStore';

const statusStyle: Record<string, string> = {
  Stable: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  Critical: 'bg-danger/10 text-danger',
  Recovering: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Discharged: 'bg-sand text-ink-faint',
};

const statusDot: Record<string, string> = {
  Stable: 'bg-indigo-500',
  Critical: 'bg-danger animate-[breathe_2s_ease-in-out_infinite]',
  Recovering: 'bg-emerald-500',
  Discharged: 'bg-stone',
};

const avatarGradients = [
  'from-emerald-400 to-emerald-600',
  'from-indigo-400 to-indigo-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
  'from-sky-400 to-sky-600',
  'from-violet-400 to-violet-600',
];

function getGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

export default function Patients() {
  const { viewMode, setViewMode, searchQuery, setSearchQuery, statusFilter, setStatusFilter, filteredPatients } = usePatientStore();
  const patients = filteredPatients();

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="animate-fade-up">
        <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400 mb-1">
          Records
        </p>
        <h1
          className="text-[32px] sm:text-[38px] font-bold text-ink tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Patients
        </h1>
        <p className="text-[14px] text-ink-muted mt-1">
          {patients.length} patient{patients.length !== 1 && 's'} found
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Search by name, ID, or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-sand/60 bg-card text-ink text-[13px] font-medium outline-none transition-all duration-300 hover:border-stone focus:border-emerald-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] placeholder:text-ink-faint/60"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3.5 rounded-xl border border-sand/60 bg-card text-ink text-[13px] font-medium outline-none transition-all duration-300 hover:border-stone focus:border-emerald-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="Stable">Stable</option>
          <option value="Critical">Critical</option>
          <option value="Recovering">Recovering</option>
          <option value="Discharged">Discharged</option>
        </select>

        {/* View Toggle */}
        <div className="flex bg-sand/30 rounded-xl p-1 self-start border border-sand/40">
          {(['grid', 'list'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`p-2.5 rounded-lg transition-all duration-300 cursor-pointer ${
                viewMode === mode
                  ? 'bg-card text-ink shadow-[var(--shadow-card)]'
                  : 'text-ink-faint hover:text-ink-muted'
              }`}
              title={`${mode} view`}
            >
              {mode === 'grid' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {patients.length === 0 ? (
        <div className="bg-card rounded-2xl border border-sand/40 p-20 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-sand/30 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-ink-faint" />
          </div>
          <p className="text-ink-muted font-semibold">No patients match your search</p>
          <p className="text-[13px] text-ink-faint mt-1">Try adjusting your filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
          {patients.map((p) => (
            <div
              key={p.id}
              className="group bg-card rounded-2xl border border-sand/40 p-5 transition-all duration-500 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 relative overflow-hidden cursor-pointer"
            >
              {/* Hover glow */}
              <div className={`absolute -top-16 -right-16 w-36 h-36 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl bg-gradient-to-br ${getGradient(p.id)}`} style={{ opacity: 0 }} />
              <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 blur-3xl bg-emerald-400" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getGradient(p.id)} flex items-center justify-center text-white text-[13px] font-bold shadow-sm transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2`}>
                    {p.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-ink truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-ink-faint font-medium">
                      {p.id} &middot; {p.age}y &middot; {p.gender}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-ink-faint opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[p.status]}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg ${statusStyle[p.status]}`}>
                    {p.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 text-[13px]">
                  {[
                    ['Condition', p.condition],
                    ['Doctor', p.doctor],
                    ['Department', p.department],
                    ['Blood Type', p.bloodType],
                    ['Last Visit', p.lastVisit],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-ink-faint font-medium">{label}</span>
                      <span className="text-ink font-semibold text-right truncate ml-3 max-w-[55%]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-sand/40 shadow-[var(--shadow-card)] overflow-x-auto animate-fade-up" style={{ animationDelay: '150ms' }}>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-sand/40">
                {['Patient', 'Condition', 'Doctor', 'Department', 'Blood', 'Status', 'Last Visit'].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint ${
                        i === 1 ? 'hidden sm:table-cell'
                          : i === 2 ? 'hidden md:table-cell'
                            : i === 3 ? 'hidden lg:table-cell'
                              : i === 4 ? 'hidden md:table-cell'
                                : i === 6 ? 'hidden lg:table-cell' : ''
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-sand/20 last:border-0 hover:bg-sand/10 transition-all duration-200 cursor-pointer group animate-fade-up"
                  style={{ animationDelay: `${180 + i * 25}ms` }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(p.id)} flex items-center justify-center text-white text-[11px] font-bold shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                        {p.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-ink truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{p.name}</p>
                        <p className="text-[10px] text-ink-faint font-medium">{p.id} &middot; {p.age}y</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-muted font-medium hidden sm:table-cell">{p.condition}</td>
                  <td className="px-5 py-4 text-ink-muted font-medium hidden md:table-cell">{p.doctor}</td>
                  <td className="px-5 py-4 text-ink-muted font-medium hidden lg:table-cell">{p.department}</td>
                  <td className="px-5 py-4 text-ink-muted font-medium hidden md:table-cell">{p.bloodType}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[p.status]}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg ${statusStyle[p.status]}`}>
                        {p.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-muted font-medium hidden lg:table-cell">{p.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
