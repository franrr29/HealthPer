import { conexionDB } from "../../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { MEMORY_SYSTEM_PROMPT, buildMemoryPrompt } from "./memory.prompt";
import { patientMemorySchema } from "../../schemas/schema.patientMemory";
import OpenAI from "openai";
import { env } from "../../config/env";
import { ConsultationSummary } from "../../schemas/schema.llmAnswer";


//Conexion con el llm:
const groqLLM = new OpenAI({
    apiKey: env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});



export async function updatePatientMemoryService(patient_id: number, new_summary: ConsultationSummary) {

    //busco si existe un registro de memoria del paciente en su tabla
    const [rows] = await conexionDB.query<RowDataPacket[]>(
        `SELECT patient_id, chronic_diseases, allergies, medications, recurrent_symptoms, master_summary 
        FROM patient_memory WHERE patient_id = ?`,
        [patient_id]
    );


    //Verifico si es nuevo paciente o ya tiene historial:
    const isNewPatient = rows.length === 0;
    const oldPatient = isNewPatient ? null : rows[0];


    //armo lo que le mando al llm con memoria vieja del paciente mas lo nuevo transcripto por el llm:
    const userPrompt = buildMemoryPrompt(oldPatient, new_summary);

    const messageForLLM =
        [
            { role: "system" as const, content: MEMORY_SYSTEM_PROMPT },
            { role: "user" as const, content: userPrompt }
        ];


    //Llamo al llm groq: 
    const response = await groqLLM.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: messageForLLM,
        response_format: { type: "json_object" }
    });


    const rawText = response.choices[0].message.content;

    if (!rawText) {

        throw new Error("LLM sent an empty answer to save into database");
    }


    //El LLM devuelve un string de texto 
    // lo convierto en objeto js para poder validarlo y acceder a sus propiedades

    const parsedJSON = JSON.parse(rawText);
    const newMemory = patientMemorySchema.parse(parsedJSON);


    //guardar en basedatos el nuevo resumen:
    if (isNewPatient) {

        //creo una nueva
        await conexionDB.query<ResultSetHeader>(
            `INSERT INTO patient_memory 
            (patient_id, chronic_diseases, allergies, medications, recurrent_symptoms, master_summary) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                patient_id,
                //convierto arrays/objetos JS a JSON string para poder guardarlos en la base de datos
                JSON.stringify(newMemory.chronic_diseases),
                JSON.stringify(newMemory.allergies),
                JSON.stringify(newMemory.medications),
                JSON.stringify(newMemory.recurrent_symptoms),
                newMemory.master_summary
            ]
        );

    } else {

        // la actualizo con los datos fusionados
        await conexionDB.query<ResultSetHeader>(
            `UPDATE patient_memory 
            SET chronic_diseases = ?, 
                allergies = ?, 
                medications = ?, 
                recurrent_symptoms = ?, 
                master_summary = ? 
            WHERE patient_id = ?`,
            [
                JSON.stringify(newMemory.chronic_diseases),
                JSON.stringify(newMemory.allergies),
                JSON.stringify(newMemory.medications),
                JSON.stringify(newMemory.recurrent_symptoms),
                newMemory.master_summary,
                patient_id
            ]
        );
    }


    return newMemory;
}