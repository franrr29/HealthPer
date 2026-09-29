import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { ArrowLeft, ArrowRight, ChevronDown, Eye, EyeOff, Sparkles, ShieldCheck } from "lucide-react";
import { loginRequest, tryDemoRequest } from "@/services/auth.service";
import { BlueprintGrid, Crosshair, Kicker } from "@/pages/welcome/Welcome";

const API_URL = import.meta.env.VITE_API_URL;

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4.5 w-4.5">
      <path fill="#4285F4" d="M23.766 12.276c0-.818-.074-1.606-.212-2.364H12.24v4.474h6.482a5.54 5.54 0 0 1-2.402 3.63v3.016h3.887c2.275-2.095 3.588-5.176 3.588-8.756z" />
      <path fill="#34A853" d="M12.24 24c3.24 0 5.956-1.075 7.943-2.908l-3.887-3.016c-1.076.72-2.45 1.147-4.056 1.147-3.12 0-5.762-2.107-6.705-4.938H1.518v3.11A11.997 11.997 0 0 0 12.24 24z" />
      <path fill="#FBBC05" d="M5.535 14.285a7.19 7.19 0 0 1-.375-2.285c0-.793.136-1.563.375-2.285V6.605H1.518A11.997 11.997 0 0 0 .24 12c0 1.936.464 3.77 1.278 5.395z" />
      <path fill="#EA4335" d="M12.24 4.773c1.763 0 3.346.606 4.59 1.796l3.444-3.444C18.19 1.19 15.475 0 12.24 0 7.61 0 3.6 2.7 1.518 6.605l4.017 3.11c.943-2.831 3.585-4.938 6.705-4.938z" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginRequest(email, password);
      login();
      navigate("/dashboard");
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? "Invalid email or password."
        : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTryDemo() {
    setDemoLoading(true);
    setError(null);

    try {
      await tryDemoRequest();
      login();
      navigate("/dashboard");
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? "Could not load demo environment."
        : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(245,245,245,1),rgba(238,242,250,0.92))] px-3 pb-4 pt-3 font-sans text-bp-text sm:px-4 sm:pb-6 sm:pt-5">
      <div className="mx-auto w-full max-w-6xl px-1 pb-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-bp-divider bg-bp-bg/92 px-3.5 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-bp-text/72 transition-colors hover:border-bp-accent hover:text-bp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bp-accent-700 focus-visible:ring-offset-2 focus-visible:ring-offset-bp-bg"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 overflow-hidden border border-bp-divider/80 bg-bp-bg shadow-[0_28px_90px_rgba(20,27,77,0.12)] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative hidden overflow-hidden border-r border-bp-divider bg-bp-text text-bp-bg lg:flex">
          <img
            src="/loginPhoto.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-22"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,46,0.18),rgba(10,14,46,0.86))]" />
          <BlueprintGrid dark className="opacity-70" />

          <div className="relative flex min-h-full flex-col justify-between px-10 py-10 xl:px-12 xl:py-12">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="relative inline-block h-[24px] w-[24px] border border-white/85">
                  <span className="absolute inset-[3px] bg-bp-accent" />
                </span>
                <span className="font-display text-lg font-bold uppercase tracking-[0.08em]">Healthper</span>
              </div>
            </div>

            <div className="my-14 max-w-[30rem]">
              <Kicker dark className="mb-4">Sign in</Kicker>
              <h1 className="font-display text-[34px] font-bold uppercase leading-[1.02] tracking-[-0.02em] [text-wrap:balance] xl:text-[42px]">
                Record. Transcribe. Summarize. All in one <span className="font-normal italic text-bp-accent-300">clinical workflow.</span>
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/68">
                Consultation audio, structured notes, patient memory, and medical decisions, all inside one clinical system.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/12 pt-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/46">Access</div>
                <div className="mt-1 font-display text-[22px] text-white">OAuth + Email</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/46">Demo mode</div>
                <div className="mt-1 font-display text-[22px] italic text-bp-accent-300">Instant preview</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col justify-center bg-bp-bg px-4 py-4 sm:px-8 sm:py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
          <Crosshair className="left-6 top-6 hidden sm:block" />
          <Crosshair className="right-6 top-6 hidden sm:block" />

          <div className="relative mx-auto w-full max-w-[28rem]">
            <div className="mb-4 border border-bp-divider/80 bg-[linear-gradient(180deg,rgba(238,242,250,0.7),rgba(245,245,245,0.98))] p-4 sm:mb-6 lg:hidden">
              <div className="flex items-center gap-2.5">
                <span className="relative inline-block h-[20px] w-[20px] border border-bp-text/75 bg-bp-bg">
                  <span className="absolute inset-[2px] bg-bp-accent-700" />
                </span>
                <span className="font-display text-sm font-bold uppercase tracking-[0.08em]">Healthper</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-bp-text/70">
                Clinical documentation, patient memory, and system access in one streamlined point.
              </p>
            </div>

            <div className="rounded-2xl border border-bp-divider bg-bp-bg p-4 shadow-[0_18px_40px_rgba(20,27,77,0.06)] sm:p-6">
              <div className="mb-5 sm:mb-6">
                <Kicker>Account</Kicker>
                <h2 className="mt-2 font-display text-[28px] font-bold uppercase leading-[1.02] tracking-[-0.015em] [text-wrap:balance] sm:text-[30px]">
                  Sign in to HealthPer
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-bp-text/70">
                  Continue with Google, use your credentials, or launch the demo preview.
                </p>
              </div>

              <div className="relative mb-5 overflow-hidden rounded-2xl border border-bp-accent/40 bg-[linear-gradient(180deg,rgba(89,128,166,0.12),rgba(89,128,166,0.03))] p-4 sm:mb-6">
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-bp-accent/20 blur-2xl" />
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-bp-accent-700">
                    <Sparkles aria-hidden="true" className="h-3 w-3 animate-pulse motion-reduce:animate-none" /> Instant Access
                  </span>
                  <h3 className="mt-2 font-display text-base font-bold uppercase tracking-[-0.01em] text-bp-text">Demo Environment</h3>
                  <p className="mt-1 text-sm leading-relaxed text-bp-text/70">
                    Test the fully functional workspace instantly with preloaded sample patients and structured notes.
                  </p>
                  <button
                    type="button"
                    onClick={handleTryDemo}
                    disabled={demoLoading || loading}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-bp-accent-700 bg-bp-accent-700 px-4 py-3 font-display text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors touch-manipulation hover:bg-bp-accent-900 disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bp-accent-700 focus-visible:ring-offset-2 focus-visible:ring-offset-bp-bg"
                  >
                    {demoLoading ? "Preparing environment…" : "Launch Demo Preview"}
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href = `${API_URL}/auth/google`;
                }}
                disabled={loading || demoLoading}
                className="flex h-[48px] w-full items-center justify-center gap-3 rounded-full border border-bp-divider bg-bp-bg font-display text-sm font-semibold uppercase tracking-wide text-bp-text transition-colors touch-manipulation hover:border-bp-accent-700 hover:bg-bp-divider/10 disabled:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bp-accent-700 focus-visible:ring-offset-2 focus-visible:ring-offset-bp-bg"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => setShowCredentials((v) => !v)}
                aria-expanded={showCredentials}
                aria-controls="credentials-form"
                className="mx-auto mt-4 flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wide text-bp-text/70 transition-colors touch-manipulation hover:text-bp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bp-accent-700 focus-visible:ring-offset-2 focus-visible:ring-offset-bp-bg rounded-full px-2 py-1"
              >
                Sign in with credentials
                <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform ${showCredentials ? "rotate-180" : ""}`} />
              </button>

              {error && (
                <div role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form
                id="credentials-form"
                onSubmit={handleLogin}
                aria-hidden={!showCredentials}
                inert={!showCredentials}
                className={`mt-4 flex-col gap-3.5 ${showCredentials ? "flex" : "hidden"}`}
              >
                <div>
                  <label htmlFor="login-email" className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wide text-bp-text/70">Email</label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@clinic.com"
                    required
                    className="h-[48px] w-full rounded-2xl border border-bp-divider bg-bp-bg px-4 text-sm text-bp-text outline-none transition-colors focus:border-bp-accent-700 focus-visible:ring-2 focus-visible:ring-bp-accent-700/30"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wide text-bp-text/70">Password</label>
                  <div className="relative">
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="h-[48px] w-full rounded-2xl border border-bp-divider bg-bp-bg pl-4 pr-11 text-sm text-bp-text outline-none transition-colors focus:border-bp-accent-700 focus-visible:ring-2 focus-visible:ring-bp-accent-700/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-bp-text/60 transition-colors hover:text-bp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bp-accent-700 rounded-full"
                    >
                      {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || demoLoading}
                  className="mt-1 flex h-[48px] w-full items-center justify-center gap-2 rounded-full border border-bp-text bg-bp-text px-4 font-display text-xs font-bold uppercase tracking-[0.14em] text-bp-bg transition-colors touch-manipulation hover:bg-bp-text/90 disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bp-accent-700 focus-visible:ring-offset-2 focus-visible:ring-offset-bp-bg"
                >
                  {loading ? "Signing in…" : "Sign In"}
                  {!loading && <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />}
                </button>
              </form>
            </div>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-center font-mono text-[11px] text-bp-text/45 sm:mt-6">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-bp-accent-700/70" /> Secured via Google OAuth, JWT & Secure HttpOnly cookies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}