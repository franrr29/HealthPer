import "dotenv/config";
import { conexionDB } from "../config/db";
import { indexConsultation } from "../services/indexing.service";


//como habia consultas sin indexar, este script se encarga de indexarlas todas q estsn en la DB
//y dehjo todo actualizado y corriendo el flujo normal cuando se firma la consuta
export async function seedIndexing() {

    const [rows] = await conexionDB.query(
        
        `SELECT id, patient_id, transcript FROM consultations WHERE transcript IS NOT NULL`);
        
        for (const row of rows as any[]) {
            
            const consultationId = row.id;
            
            const patientId = row.patient_id;
            
            const transcript = row.transcript;

    await indexConsultation(patientId, consultationId, transcript);
    
    await new Promise(resolve => setTimeout(resolve, 700)); 
}

        console.log(`${(rows as any[]).length} consultas indexadas`);
}

seedIndexing ()