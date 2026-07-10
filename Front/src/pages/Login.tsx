import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import api from "@/services/api";


//Loggear usuario, envia email y password a auth.controller y llama auth.service y devuelve token correcto
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth()!;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-6 border border-[#E2E8F0] w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#2D3748] mb-6">HealthPer</h1>

        {/* form del front qe envia email y passw y trae token si hay y navega a dashboard */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);

            try {
              const response = await api.post("auth/login", {
                email,password});

              login(response.data.data.token, response.data.data.refreshToken);
              navigate("/dashboard");

            } catch (err) {
              // Si la api no devuelve un mensaje usa uno por defecto geenrico
                const message= err.response?.data?.message ?? "Something went wrong";
                setError(message);

            } finally {
              setLoading(false);
            }
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#2D3748] placeholder-[#A0AEC0] focus:outline-none focus:border-[#3B9ECF]"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-[#2D3748] placeholder-[#A0AEC0] focus:outline-none focus:border-[#3B9ECF]"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#3B9ECF] text-white rounded-xl px-5 py-2.5 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* boton login con google */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "http://localhost:4000/auth/google";
            }}
            className="bg-white text-[#2D3748] rounded-xl px-5 py-2.5 border border-[#E2E8F0] shadow-sm font-medium w-full"
          >
            Login with Google
          </button>

          <button
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                setError(null);

                const response = await api.post("auth/try-demo");
                login(response.data.data.token, response.data.data.refreshToken);
                navigate("/dashboard");

              } catch (err) {
                const message =err.response?.data?.message ?? "Something went wrong";
                setError(message);

              } finally {
                setLoading(false);
              }
            }}
            className="bg-white text-[#2D3748] rounded-xl px-5 py-2.5 border border-[#E2E8F0] shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full"
          >
            {loading ? "Loading..." : "Try Demo"}
          </button>
        </form>
      </div>
    </div>
  );
}