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
    <div className="relative flex min-h-screen items-center justify-center bg-[#F2EEE3] p-4 pt-16 lg:pt-4">

      {/* barra mobile para volver */}
      <Link
        to="/"
        className="fixed left-0 right-0 top-0 z-50 flex items-center gap-2 bg-[#2F3B35] px-4 py-3 text-sm font-medium text-white lg:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <Link
        to="/"
        className="absolute left-4 top-4 sm:left-6 sm:top-6 hidden lg:inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-3.5 py-2 text-xs font-semibold text-[#535B4F] hover:text-foreground transition-colors duration-200"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-[#C0C3B8] bg-white shadow-sm lg:flex-row">
        {/* panel izquierdo imagen de fondo */}
        <div
          className="relative hidden lg:flex lg:w-1/2 items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/loginPhoto.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#2F3B35]/75" />

          <div className="relative px-8 pb-10 text-center">
            <h2 className="font-feature text-2xl font-semibold leading-tight text-white">
              From live audio
              <br />
              <span className="text-[#E9DEC8]">to clinical notes, automatically.</span>
            </h2>
            <p className="mt-3 text-sm text-[#EDF2EE]/80">
              Record, get AI-powered insights, and deliver structured summaries straight to your patients.
            </p>
          </div>
        </div>

        {/* panel derecho */}
        <div className="flex flex-1 items-center justify-center bg-white px-6 py-16 sm:px-10 lg:px-16">
          <div className="w-full max-w-md">

            {/* header */}
            <div className="mb-6 text-center">
              <h1 className="font-feature text-3xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#6B7268]">
                Sign in to continue to your workspace.
              </p>
            </div>

            {/* seccion recruiter demo */}
            <div className="mb-6 rounded-lg border border-[#3B4A42] bg-[#2F3B35] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#E9DEC8]" />
                <span className="text-sm font-semibold text-white">
                  Explore the live application
                </span>
              </div>

              <p className="mb-5 text-sm leading-6 text-[#EDF2EE]/80">
                Experience the full platform with realistic patient data, AI consultations, and every core feature—no account or setup required.
              </p>

              <button
                type="button"
                disabled={loading}
                onClick={handleTryDemo}
                className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-gradient-to-b from-[#3D5A82] via-[#1B2A41] to-[#233A54] text-base font-bold text-[#FCD34D] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_-2px_4px_0_rgba(0,0,0,0.35),0_4px_12px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                {/* brillo diagonal, efecto metalizado */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <span className="relative">
                  {loading ? "Preparing Demo..." : "Recruiter Preview"}
                </span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* google */}
            <button
              type="button"
              onClick={() => {
                window.location.href = `${API_URL}/auth/google`;
              }}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-[#C0C3B8] bg-[#F2EEE3] text-sm font-medium text-[#414740] transition-colors duration-200 hover:bg-white"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* separador */}
            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-[#C0C3B8]" />
              <span className="mx-4 text-xs uppercase tracking-wider text-[#8B9086]">
                or continue with email
              </span>
              <div className="h-px flex-1 bg-[#C0C3B8]" />
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#414740]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@clinic.com"
                  className="h-11 w-full rounded-md border border-[#C0C3B8] bg-[#F2EEE3] px-4 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-[#8B9086] focus:border-[#5E7367] focus:bg-white focus:ring-4 focus:ring-[#EDF2EE]"
                />
              </div>

              {/* password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-[#414740]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-md border border-[#C0C3B8] bg-[#F2EEE3] pl-4 pr-11 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-[#8B9086] focus:border-[#5E7367] focus:bg-white focus:ring-4 focus:ring-[#EDF2EE]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#8B9086] transition-colors hover:text-[#535B4F]"
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
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center rounded-md bg-[#2F3B35] text-sm font-medium text-white transition-colors duration-200 hover:bg-[#3B4A42] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

            </form>

            <p className="mt-6 text-center text-xs leading-5 text-[#8B9086]">
              Protected with Google OAuth and JWT authentication.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}