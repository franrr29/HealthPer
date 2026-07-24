//Get para traer datos del doctor y mostrarlos en el dashboard:

import api from "../services/api";
import type { DoctorStats, RecentActivity, TopConditions } from "../types/doctor";

export async function getDoctorData(): Promise<any> {

    const response = await api.get("/doctor/me");
    
    return response.data.data;
}


//datos de estadisticas del doctor para mostrar en el dashboard:
export async function getDoctorStats (): Promise<DoctorStats> {

    const response = await api.get("/doctor/stats");
    
    return response.data.data;
}


//datos de actividad reciente del doctor 
export async function getRecentActivities (): Promise<RecentActivity[]> {

    const response = await api.get("/doctor/recent-activity");

    return response.data.data;
}


//datos de las condiciones más frecuentes del doctor
export async function getTopConditions (): Promise<TopConditions> {

    const response = await api.get("/doctor/top-conditions");

    return response.data.data;
}