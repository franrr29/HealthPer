import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { ArrowLeft, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import api from "@/services/api";

const API_URL = import.meta.env.VITE_API_URL;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
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

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("auth/login", { email, password });
      login();
      navigate("/dashboard");
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? "Something went wrong"
        : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTryDemo() {
    setLoading(true);
    setError(null);

    try {
      await api.post("auth/try-demo");
      login();
      navigate("/dashboard");
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? "Something went wrong"
        : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-100 p-4 pt-16 lg:pt-4 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300">

      {/* barra mobile para volver */}
      <Link
        to="/"
        className="neu-button fixed left-0 right-0 top-0 z-50 flex items-center gap-2 rounded-b-2xl bg-slate-900/95 px-4 py-3 text-sm font-medium text-white lg:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <Link
        to="/"
        className="neu-card absolute left-4 top-4 sm:left-6 sm:top-6 hidden lg:inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:brightness-95 hover:text-slate-900 transition-all duration-200"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="neu-card flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-white lg:flex-row">
        {/* panel izquierdo imagen de fondo */}
        <div
          className="relative hidden lg:flex lg:w-1/2 items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/loginPhoto.jpg')" }}
        >
          <div className="absolute inset-0 bg-slate-900/70" />

          <div className="relative px-8 pb-10 text-center">
            <h2 className="text-2xl font-bold leading-tight text-white">
              From live audio
              <br />
              <span className="text-blue-500">to clinical notes, automatically.</span>
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Record, get AI-powered insights, and deliver structured summaries straight to your patients.
            </p>
          </div>
        </div>

        {/* panel derecho */}
        <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-white to-slate-50 px-6 py-16 sm:px-10 lg:px-16">
          <div className="neu-card w-full max-w-md rounded-3xl border border-border bg-white p-8">

            {/* header */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to continue to your workspace.
              </p>
            </div>

            {/* seccion recruiter demo */}
            <div className="mb-6 rounded-2xl border border-blue-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/80 p-5 shadow-xl shadow-black/20">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-semibold text-white">
                  Explore the live application
                </span>
              </div>

              <p className="mb-5 text-sm leading-6 text-slate-300">
                Experience the full platform with realistic patient data, AI consultations, and every core feature—no account or setup required.
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={handleTryDemo}
                className="neu-button-dark group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:from-amber-300 hover:to-orange-300"
              >
                <span>
                  {loading ? "Preparing Demo..." : "Recruiter Preview"}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* google */}
            <button
              type="button"
              onClick={() => {
                window.location.href = `${API_URL}/auth/google`;
              }}
              className="neu-button flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-white"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* separador */}
            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="mx-4 text-xs uppercase tracking-wider text-slate-400">
                or continue with email
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@clinic.com"
                  className="neu-inset h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="neu-inset h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-11 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="neu-button flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-slate-800/90 via-slate-900/95 to-slate-950/95 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

            </form>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Protected with Google OAuth and JWT authentication.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}