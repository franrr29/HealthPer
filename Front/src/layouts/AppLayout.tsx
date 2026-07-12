import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

//componente que renderiza la barra de navegacion y el contenido de la ruta protegida
export default function AppLayout() {

    //saco el logout del context y el navigate para redirigir despues de salir
    const { logout } = useAuth();
    const navigate = useNavigate();

    //cierro sesion y mando al login
    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* sidebar desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-6">
                <p className="text-xl font-bold text-primary mb-8">HealthPer</p>

                <nav className="flex flex-col gap-1">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? "bg-accent text-accent-foreground py-2 px-3 rounded-lg text-sm font-medium"
                                : "text-muted-foreground py-2 px-3 rounded-lg text-sm font-medium"
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/patients"
                        className={({ isActive }) =>
                            isActive
                                ? "bg-accent text-accent-foreground py-2 px-3 rounded-lg text-sm font-medium"
                                : "text-muted-foreground py-2 px-3 rounded-lg text-sm font-medium"
                        }
                    >
                        Patients
                    </NavLink>
                </nav>

                {/* logout abajo de todo, empujado con mt-auto */}
                <button
                    onClick={handleLogout}
                    className="mt-auto text-left text-muted-foreground py-2 px-3 rounded-lg text-sm font-medium"
                >
                    Logout
                </button>
            </aside>

            {/* nav mobile */}
            <div className="md:hidden w-full fixed top-0 left-0 z-10 bg-card border-b border-border px-4 py-3 flex gap-4 items-center">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "text-primary text-sm font-medium"
                            : "text-muted-foreground text-sm font-medium"
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/patients"
                    className={({ isActive }) =>
                        isActive
                            ? "text-primary text-sm font-medium"
                            : "text-muted-foreground text-sm font-medium"
                    }
                >
                    Patients
                </NavLink>

                {/* logout a la derecha en mobile */}
                <button
                    onClick={handleLogout}
                    className="ml-auto text-muted-foreground text-sm font-medium"
                >
                    Logout
                </button>
            </div>

            {/* contenido de la ruta protegida */}
            <main className="flex-1 p-4 md:p-8 mt-12 md:mt-0">
                <Outlet />
            </main>
        </div>
    );
}