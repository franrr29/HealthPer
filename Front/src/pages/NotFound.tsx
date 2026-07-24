//Pagina no encontrada para rutas no definidas
import { Link } from "react-router-dom"


export default function NotFound() {

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/dashboard" className="px-4 py-2 bg-navy text-white rounded hover:opacity-90">
                Go to Dashboard
            </Link>
        </div>
    )
}