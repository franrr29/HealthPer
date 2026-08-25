import { createContext, useState, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    //para el estado de auth y persistirlo en localStorage para que no se pierda al recargar la pagina
    //solo necesito saber si hay sesion o no a dif que si fuera con roles necesitaba un endpoint auth/me y devolver 
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );

    const queryClient = useQueryClient();


    function login() {
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
    }

    function logout() {
        fetch("/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false);
        queryClient.clear();
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


//exporto un hook para usar el contexto de auth en cualquier componente
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}