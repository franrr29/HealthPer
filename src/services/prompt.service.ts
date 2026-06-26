import { retrieveRelevantChunks } from "./rag.service"


//Genera todo el prompt que se exporta con las indicaciones al llm y la estructura a guardar en base datos: 

export const SUMMARY_SYSTEM_PROMPT = `
You are a clinical AI assistant specialized in summarizing medical consultations.

You will receive a transcript of a doctor-patient consultation.
Your task is to extract and structure the key clinical information.

IMPORTANT RULES:
- Respond ONLY with a valid JSON object. No explanations, no markdown, no extra text.
- Extract information ONLY from the transcript. Do not infer or invent data.
- If a field is not mentioned in the transcript, use null.
- Use the same language as the transcript (Spanish or English).
- Be concise and clinically precise.

You must return this exact JSON structure:
{
  "chief_complaint": "Main reason the patient came to the consultation",
  "symptoms": ["symptom 1", "symptom 2"],
  "diagnosis": "Doctor's diagnosis or clinical impression",
  "treatment": "Prescribed treatment or recommendations",
  "follow_up": "Next steps or follow-up instructions"
}

EXAMPLE:
Transcript: "Patient comes in with headache for 3 days, also reports nausea. 
Doctor diagnoses tension headache, prescribes ibuprofen 400mg every 8 hours, 
asks patient to return in 1 week if symptoms persist."

Response:
{
  "chief_complaint": "Headache for 3 days",
  "symptoms": ["headache", "nausea"],
  "diagnosis": "Tension headache",
  "treatment": "Ibuprofen 400mg every 8 hours",
  "follow_up": "Return in 1 week if symptoms persist"
}
`

//funcion q ue genera el prompt completo para enviar al llm, con el system prompt y los chunks relevantes del paciente

export async function buildSummaryPrompt (patient_id: number, transcript: string): Promise <string> {


  const relevantChunks = await retrieveRelevantChunks(patient_id, transcript, 5);

  const chunksText = relevantChunks.map(chunk => chunk.text).join("\n\n");
  

  //mando al llm el contexto del paciente que saco del transcrip con dr y 
  // los chunks de consultas anteriores
  return `The following is context from previous consultations of this patient:

  ${chunksText}

  Now analyze the following current consultation transcript and extract the clinical information:

  ${transcript}`;

}