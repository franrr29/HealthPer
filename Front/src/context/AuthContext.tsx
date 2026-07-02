import { createContext, useState, useContext } from "react";

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
        //borro la cookie del token del localStorage para que no se pueda usar mas
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
    }

    return (
        <AuthContext.Provider value={{token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}