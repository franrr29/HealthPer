//el back guarda el resumen como json lo convierto en los campos de arriba para mostrarlos en el form

import type { SummaryFields } from "@/types/editSummary";

export function parseSummary(raw: string): SummaryFields | null {

    try {

        const parsed = JSON.parse(raw);

        return {
            chief_complaint: parsed.chief_complaint ?? "",
            symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms.join(", ") : "",
            diagnosis: parsed.diagnosis ?? "",
            treatment: parsed.treatment ?? "",
            follow_up: parsed.follow_up ?? "",
        };

    } catch {

        return null;
    }
}

//convierte los campos del form de vuelta al mismo formato json que espera el back sino genera conflico al guardar
export function serializeSummary(fields: SummaryFields): string {

    return JSON.stringify({

        chief_complaint: fields.chief_complaint || null,
        symptoms: fields.symptoms.split(",").map((symptom) => symptom.trim()).filter(Boolean),
        diagnosis: fields.diagnosis || null,
        treatment: fields.treatment || null,
        follow_up: fields.follow_up || null,
    });
}