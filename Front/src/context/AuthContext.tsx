import { createContext, useState, useContext } from "react";

type AuthContextType = {
  token: string | null
  login: (newToken: string) => void
  logout: () => void
}

const miContexto = createContext<AuthContextType | null>(null)

//componente que provee el contexto a los componentes hijos
export default function AuthProvider({children}: {children: React.ReactNode}) {

    const [token, setToken] = useState<string | null>(null);

    function login(newToken: string) {
        setToken(newToken);
    }

    function logout() {
        setToken(null);
    }

    return (
        <miContexto.Provider value={{token, login, logout}}>
            {children}
        </miContexto.Provider>
    )
}

export function useAuth() {
    return useContext(miContexto)
}