
import { useAuth } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
    
    const { token } = useAuth()!

    if (!token) {
        return <Navigate to="/login" replace />
    }

    //outlet renderiza el componente hijo de la ruta protegida
    return <Outlet />
    
    
}