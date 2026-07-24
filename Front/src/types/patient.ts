//Types para el paciente que esta como en la basedatos:

export type Patient = {
    id: number;
    name: string;
    birth_date: string;
    gender: "M" | "F" | "X" | "U";
    national_id: string;
    phone: string;
}

export type PatientFollowUp = {
    id: number;
    name: string;
    last_consultation: string | null;
    days_since_last_visit: number | null;
}

export type PatientChatWidgetProps = {
  patientId: number;
};

export type ChatMessage = {
    question: string;
    answer: string;
}
export type PatientFormProps = {
    patient?: Patient;
}

