import api from "../services/api";
import type { Patient } from "@/types/patient";


//envia peticion a patient.controller que saca doctor_id de rq.user y manda al serivce para que haga la query:
export async function getPatients(): Promise<Patient[]> {

    //sin try pq tanQuery atrapa el error
    const response = await api.get("/patients");
    return response.data.data;
}