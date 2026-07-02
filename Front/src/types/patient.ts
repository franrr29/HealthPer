//Types para el paciente que esta como en la basedatos:

export type Patient = {
    id: number;
    name: string;
    birth_date: string;
    gender: "M" | "F" | "X" | "U";
    national_id: string;
    phone: string;
}

