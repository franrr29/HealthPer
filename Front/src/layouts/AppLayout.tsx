import { NavLink, Outlet } from "react-router-dom";


//componente que renderiza la barra de navegacion y el contenido de la ruta protegida
export default function AppLayout() {
    return (
        <div>
            <nav>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/patients">Patients</NavLink>
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    );
}