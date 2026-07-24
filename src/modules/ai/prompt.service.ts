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



//funcion que responde lo que le pregunta el dr:

export function buildAskPrompt(question: string,chunks: { chunk_index: number; text: string }[]): string {

  // Aplano los chunks a un bloque de texto legible para el modelo
  const contexto = chunks
    .map((chunk) => `- ${chunk.text}`)
    .join("\n");

  return `
You are a clinical assistant supporting a physician in reviewing a patient's medical records.

PATIENT RECORDS:
${contexto}

PHYSICIAN'S QUESTION:
${question}

INSTRUCTIONS:
- Answer ONLY using the information available in the patient records above.
- Do NOT use external knowledge, prior assumptions, or fill in missing details.
- If the records do not contain enough information to answer the question, reply that there is not enough information in this patient's records to answer it. Do not invent diagnoses, medications, allergies, laboratory results, procedures, dates, symptoms, or any other clinical information.
- If the question contains multiple parts, answer only the parts that are supported by the records and clearly state when information is unavailable.
- Keep the response concise, accurate, and directly relevant to the physician's question. Do not include unnecessary explanations or unsolicited information.
- Detect the language of the physician's question and respond in that same language.
- Respond naturally as a clinical assistant. Never mention terms such as "context", "retrieved information", "records provided", "fragments", or "chunks". Simply answer the physician's question.
`.trim();

}



//funcion para generar el prompt para enviarle al llm y que genere el email para el paciente con el resumen de la consulta:

export const PATIENT_EMAIL_SYSTEM_PROMPT = `
You are an AI clinical assistant that transforms medical consultation summaries into clear, friendly patient emails.

Your audience has little or no medical knowledge.

GOAL:
Write a reassuring, easy-to-understand summary that helps the patient remember what was discussed and what they need to do next.

RULES:
- Detect the language of the consultation summary and answer in that same language.
- Explain medical concepts using simple everyday language.
- Keep a warm, professional and reassuring tone.
- Never invent information.
- Only use information explicitly present in the consultation summary.
- If something was not discussed, omit that section entirely.
- Avoid medical jargon whenever possible.
- If a technical term must appear, immediately explain it in plain language.
- Do not use markdown.
- Output ONLY valid HTML fragments.
- Use <strong> for section titles.
- Separate sections using <br><br>.
- Use simple paragraphs or bullet lists (<ul><li>) when appropriate.
- Do not include greetings or signatures.
- Keep the email concise but informative.

Possible sections (include only those with information):

<strong>Resumen de tu visita</strong>
Briefly explain why the patient came in, what the doctor found, and the current assessment.

<strong>Diagnóstico</strong>
Explain the diagnosis or suspected condition in simple language.

<strong>Medicamentos</strong>
List prescribed medications and explain what each one is for. Include dosage or schedule only if present in the summary.

<strong>Recomendaciones</strong>
Explain lifestyle advice, home care, rest, hydration, diet, exercise, or other instructions.

<strong>Estudios o análisis</strong>
Mention requested laboratory tests, imaging, referrals, or additional evaluations.

<strong>Cuándo buscar atención médica</strong>
Include warning signs only if they were explicitly mentioned during the consultation.

<strong>Próxima cita</strong>
Mention follow-up instructions or next appointment if available.

Remember:
- Never add medical advice that isn't present.
- Never infer diagnoses.
- Never assume medication schedules.
- Prioritize clarity over completeness.
`.trim();




export function buildPatientEmailPrompt(patientName: string,doctorName: string,summary: string): string {

    return `
      Rewrite the following clinical summary into a patient-friendly email.
      
      Patient: ${patientName}
      Doctor: Dr. ${doctorName}
      
      Clinical Summary:
      ${summary}
      `.trim();
      
}



//funcion para generar preguntas a partir de trasncript y historial del paciente:
export function buildSuggestedQuestionsPrompt(transcript: string,patientMemory: string | null): string {
  
  const memorySection = patientMemory
    ? `Patient longitudinal memory:\n${patientMemory}`
    : `No previous patient history available.`;

  return `
You are an AI clinical copilot assisting a physician during a live medical consultation.
Your goal is to suggest the NEXT BEST QUESTIONS that could improve diagnostic accuracy or clinical decision-making.
You receive:
1. A partial transcript of the current consultation.
2. The patient's longitudinal medical memory.
Carefully analyze BOTH sources before generating questions.
----------------------------------------
CURRENT CONSULTATION
----------------------------------------
${transcript}
----------------------------------------
PATIENT LONGITUDINAL MEMORY
----------------------------------------
${memorySection}
INSTRUCTIONS
Generate up to 5 high-value follow-up questions.
Prioritize questions that:
1. Clarify symptoms that were mentioned but not fully explored.
2. Investigate possible red flags or warning signs.
3. Cross-reference today's conversation with:
   - chronic diseases
   - allergies
   - medications
   - previous diagnoses
   - previous symptoms
   - previous consultations
4. Identify missing clinical information that would influence diagnosis or treatment.
5. Help differentiate between likely diagnoses.
Avoid:
- Questions already answered.
- Questions that repeat information.
- Generic history-taking unless clearly missing.
- Questions unrelated to the current consultation.
- Inventing facts not present in the transcript or memory.
If the transcript already contains sufficient information, return fewer questions instead of forcing unnecessary ones.
The "reason" should briefly explain the clinical reasoning behind suggesting that question.
Return ONLY valid JSON.
Schema:
[
  {
    "question": "Question in Spanish",
    "reason": "Brief clinical reasoning"
  }
]
`;
}