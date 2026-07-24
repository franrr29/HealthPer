export type EditSummaryProps = {
    consultationId: number;
    summary: string;
};

//campos del resumen que genera la IA, symptoms como texto separado por comas para que sea facil de editar
export type SummaryFields = {
    chief_complaint: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    follow_up: string;
};
