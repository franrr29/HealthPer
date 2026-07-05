import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPatient } from "@/services/patients.service";
import type { Patient } from "@/types/patient";


//custom hook para crear un paciente nuevo y actualizar la cache de react-query:
export function useCreatePatientMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (patientData: Omit<Patient, "id">) => {
            return createPatient(patientData);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["patients"],
            });
        },
    });
}