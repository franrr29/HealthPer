import { createContext, useState, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  token: string | null
  login: (newToken: string, newRefreshToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

//componente que provee el contexto a los componentes hijos
export default function AuthProvider({children}: {children: React.ReactNode}) {

    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    //cliente de tanstack query para limpiar la cache al cerrar sesion
    const queryClient = useQueryClient();

    function login(newToken: string, newRefreshToken: string) {

        //guardo token en localStorage para que persista aunque se recargue la pagina
        localStorage.setItem("token", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        setToken(newToken);
        setRefreshToken(newRefreshToken);
    }

    function logout() {

        setToken(null);
        setRefreshToken(null);

        //borro los tokens del localStorage para que no se puedan usar mas
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        //limpio la cache asi no queda data del doctor anterior si loguea otro
        queryClient.clear();
    }

    return (
        <AuthContext.Provider value={{token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

//hook que devuelve el contexto de auth, para usarlo en los componentes hijos
export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}