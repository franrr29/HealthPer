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

    //form del front qe envia email y passw y trae token si hay y navega a dashboard:
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
          const response = await api.post("auth/login", {
            email,password});

          login(response.data.data.token);
          navigate("/dashboard");

        } catch (err) {
          // Si la api no devuelve un mensaje usa uno por defecto geenrico
            const message= err.response?.data?.message ?? "Something went wrong";
            setError(message);;

        } finally {
          setLoading(false);
        }
      }}
    >
      <div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>

      {error && <p>{error}</p>}

      
      <Button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}