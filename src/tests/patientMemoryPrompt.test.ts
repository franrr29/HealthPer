// Test unitario puro: sin DB, sin mocks, sin llamadas a LLM.
// Cubre formatPatientMemoryForPrompt en aislamiento, input -> output.

import { formatPatientMemoryForPrompt } from "../modules/ai/prompt.service";

describe("formatPatientMemoryForPrompt", () => {

    test("devuelve null si no hay memoria (paciente sin consultas firmadas)", () => {

        expect(formatPatientMemoryForPrompt(null)).toBeNull();
    });

    test("devuelve un string con las 5 lineas si todos los campos estan poblados", () => {

        const result = formatPatientMemoryForPrompt({
            chronic_diseases: ["Hipertensión arterial", "Diabetes tipo 2"],
            allergies: ["Penicilina"],
            medications: ["Losartán 50mg", "Insulina NPH 10U nocturna"],
            recurrent_symptoms: ["Dolor de cabeza y mareos"],
            master_summary: "Paciente con hipertensión y diabetes tipo 2, alérgico a penicilina."
        });

        expect(result).toBe(
            "Chronic diseases: Hipertensión arterial, Diabetes tipo 2\n" +
            "Allergies: Penicilina\n" +
            "Current medications: Losartán 50mg, Insulina NPH 10U nocturna\n" +
            "Recurrent symptoms: Dolor de cabeza y mareos\n" +
            "Overall summary: Paciente con hipertensión y diabetes tipo 2, alérgico a penicilina."
        );
    });

    test("omite las lineas de los campos vacios/null y deja solo las que tienen contenido", () => {

        const result = formatPatientMemoryForPrompt({
            chronic_diseases: [],
            allergies: ["Penicilina"],
            medications: null,
            recurrent_symptoms: [],
            master_summary: "  "
        });

        expect(result).toBe("Allergies: Penicilina");
    });

    test("devuelve null si la fila existe pero todos los campos estan vacios", () => {

        const result = formatPatientMemoryForPrompt({
            chronic_diseases: [],
            allergies: [],
            medications: [],
            recurrent_symptoms: [],
            master_summary: null
        });

        expect(result).toBeNull();
    });

});
