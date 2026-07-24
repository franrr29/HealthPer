import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const { login } = useAuth();
  login();
  return <Navigate to="/dashboard" />;
}