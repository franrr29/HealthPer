import { Navigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";


//recibe token y refresh token de la url y los guarda en el contexto de auth y redirige a dashboard
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth()!;

  const token = searchParams.get("token");
  const refreshToken = searchParams.get("refreshToken");


  //si hay token y refresh token los guarda en el contexto de auth
  useEffect(() => {
    if (token && refreshToken) {
      login(token, refreshToken);
    }
  }, [token, refreshToken, login]);

  //si no hay token o refresh token redirige a login
  if (!token || !refreshToken) {
    return <Navigate to="/login" />;
  }

 //si hay token y refresh token redirige a dashboard
  return <Navigate to="/dashboard" />;
}