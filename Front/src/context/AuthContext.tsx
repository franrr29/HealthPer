import { createContext, useState, useContext } from "react";

type AuthContextType = {
  token: string | null
  login: (newToken: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

//componente que provee el contexto a los componentes hijos
export default function AuthProvider({children}: {children: React.ReactNode}) {

    const [token, setToken] = useState<string | null>(null);

    function login(newToken: string) {

        //guardo token en localStorage para que persista aunque se recargue la pagina
        localStorage.setItem("token", newToken);
        

        setToken(newToken);
    }

    function logout() {

        setToken(null);
        //borro la cookie del token del localStorage para que no se pueda usar mas
        localStorage.removeItem("token");
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