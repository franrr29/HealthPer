//Get para traer datos del doctor y mostrarlos en el dashboard:

import api from "../services/api";
import type { DoctorStats } from "../types/doctor";

export async function getDoctorData(): Promise<any> {

    const response = await api.get("/doctor/me");
    
    return response.data.data;
}


//datos de estadisticas del doctor para mostrar en el dashboard:
export async function getDoctorStats (): Promise<DoctorStats> {

    const response = await api.get("/doctor/stats");
    
    return response.data.data;
}