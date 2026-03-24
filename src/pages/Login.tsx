import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const { login, signup, loading, error, clearError } = useAuthStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });

  const nameValid = name.trim().length >= 2;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;
  const confirmValid = password === confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!emailValid || !passwordValid) return;
    if (isSignUp && (!nameValid || !confirmValid)) return;
    clearError();
    if (isSignUp) await signup(email, password, name.trim());
    else await login(email, password);
  };

  const toggleMode = () => {
    setIsSignUp((v) => !v);
    clearError();
    setTouched({ name: false, email: false, password: false, confirmPassword: false });
  };

  const inputCls = (valid: boolean, isTouched: boolean) =>
    `w-full px-4 py-3.5 rounded-xl bg-card text-ink text-[14px] font-medium outline-none transition-all duration-300 border placeholder:text-ink-faint/60 ${
      isTouched && !valid
        ? 'border-danger shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
        : 'border-sand/60 hover:border-stone focus:border-emerald-400 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]'
    }`;

  return (
    <div className="min-h-screen flex bg-body-bg transition-colors duration-400 relative overflow-hidden">
      {/* Global ambient orbs */}
      <div className="orb w-[500px] h-[500px] bg-emerald-400 top-[-10%] left-[20%] animate-float-slow" />
      <div className="orb w-[400px] h-[400px] bg-emerald-300 bottom-[-5%] right-[10%] animate-float-slow" style={{ animationDelay: '-3s' }} />
      <div className="orb w-[300px] h-[300px] bg-indigo-400/30 top-[40%] left-[-5%] animate-float-slow" style={{ animationDelay: '-5s' }} />

      {/* Left — decorative hero */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950" />

        {/* Decorative mesh */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating glass cards — decorative */}
        <div className="absolute top-[18%] left-[8%] w-48 h-28 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 p-4 animate-float-slow">
          <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div className="h-2 w-24 rounded bg-white/10 mb-1.5" />
          <div className="h-2 w-16 rounded bg-white/5" />
        </div>

        <div className="absolute top-[55%] right-[12%] w-44 h-24 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 p-4 animate-float-slow" style={{ animationDelay: '-2s' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-emerald-400/20" />
            <div className="h-2 w-20 rounded bg-white/10" />
          </div>
          <div className="flex gap-1">
            {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-emerald-400/20" style={{ height: `${h * 0.4}px` }} />
            ))}
          </div>
        </div>

        <div className="absolute bottom-[12%] left-[15%] w-52 h-20 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 p-4 animate-float-slow" style={{ animationDelay: '-4s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div>
              <div className="h-2 w-20 rounded bg-white/15 mb-1.5" />
              <div className="h-1.5 w-14 rounded bg-white/5" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-14 text-white w-full">
          <div className="flex items-center gap-3 animate-fade-up">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 4v16M4 12h16" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              MedConnect
            </span>
          </div>

          <div className="max-w-lg animate-fade-up" style={{ animationDelay: '150ms' }}>
            <h1
              className="text-[52px] font-bold leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Where precision
              <br />
              meets <span className="italic text-emerald-300">compassion.</span>
            </h1>
            <p className="mt-6 text-white/50 text-[16px] leading-relaxed max-w-md">
              Streamline patient care, harness real-time analytics, and make smarter
              clinical decisions — all from one unified platform.
            </p>

            {/* Trust badges */}
            <div className="flex items-center gap-3 mt-10">
              {['HIPAA Compliant', '99.9% Uptime', '256-bit Encrypted'].map((badge, i) => (
                <span
                  key={badge}
                  className="px-3.5 py-2 bg-white/[0.06] backdrop-blur-sm rounded-xl text-[11px] font-bold tracking-wide text-white/60 border border-white/[0.08] animate-fade-up"
                  style={{ animationDelay: `${300 + i * 80}ms` }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <p className="text-white/20 text-[12px] animate-fade-up" style={{ animationDelay: '500ms' }}>
            &copy; 2026 MedConnect Healthcare Technologies
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-14 animate-fade-up">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[var(--glow-emerald)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 4v16M4 12h16" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-ink" style={{ fontFamily: "'Playfair Display', serif" }}>
              Med<span className="text-gradient">Connect</span>
            </span>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            <h2
              className="text-[34px] font-bold text-ink tracking-tight leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-ink-muted mt-2 mb-10 text-[15px]">
              {isSignUp ? 'Start your journey with MedConnect' : 'Sign in to your dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" style={{ animationDelay: '200ms' }}>
            {error && (
              <div className="bg-danger/5 border border-danger/15 text-danger rounded-xl px-4 py-3.5 text-[13px] font-semibold animate-scale-in flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
                {error}
              </div>
            )}

            {isSignUp && (
              <div className="animate-fade-up">
                <label className="block text-[12px] font-bold uppercase tracking-[0.08em] text-ink-muted mb-2">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError(); }}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  placeholder="Dr. Jane Smith"
                  className={inputCls(nameValid, touched.name)}
                />
                {touched.name && !nameValid && <p className="text-danger text-[11px] mt-1.5 font-semibold">Name must be at least 2 characters</p>}
              </div>
            )}

            <div className="animate-fade-up" style={{ animationDelay: '50ms' }}>
              <label className="block text-[12px] font-bold uppercase tracking-[0.08em] text-ink-muted mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@hospital.com"
                className={inputCls(emailValid, touched.email)}
              />
              {touched.email && !emailValid && <p className="text-danger text-[11px] mt-1.5 font-semibold">Enter a valid email address</p>}
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
              <label className="block text-[12px] font-bold uppercase tracking-[0.08em] text-ink-muted mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder={isSignUp ? 'Minimum 6 characters' : 'Enter your password'}
                  className={`${inputCls(passwordValid, touched.password)} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted cursor-pointer transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && !passwordValid && <p className="text-danger text-[11px] mt-1.5 font-semibold">Password must be at least 6 characters</p>}
            </div>

            {isSignUp && (
              <div className="animate-fade-up">
                <label className="block text-[12px] font-bold uppercase tracking-[0.08em] text-ink-muted mb-2">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                  onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                  placeholder="Re-enter your password"
                  className={inputCls(confirmValid, touched.confirmPassword)}
                />
                {touched.confirmPassword && !confirmValid && <p className="text-danger text-[11px] mt-1.5 font-semibold">Passwords do not match</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 mt-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50 text-white text-[14px] font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-[var(--glow-emerald)] hover:shadow-[var(--glow-emerald-strong)] hover:-translate-y-px active:translate-y-0 active:shadow-[var(--glow-emerald)]"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials — only on sign in */}
          {!isSignUp && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15 animate-fade-up" style={{ animationDelay: '250ms' }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400 mb-2">
                Demo Account
              </p>
              <div className="flex items-center justify-between text-[13px]">
                <div>
                  <p className="text-ink font-semibold">demo@jonattan.com</p>
                  <p className="text-ink-muted font-medium">Admin123</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('demo@jonattan.com');
                    setPassword('Admin123');
                    clearError();
                  }}
                  className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                  Use Demo
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-sand to-transparent" />
          </div>

          <p className="text-[14px] text-ink-muted text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={toggleMode}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
