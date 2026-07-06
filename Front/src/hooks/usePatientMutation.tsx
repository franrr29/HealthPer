import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPatient, updatePatient } from "@/services/patients.service";
import type { Patient } from "@/types/patient";
import { deletePatient } from "@/services/patients.service";


//custom hook para crear un paciente nuevo y actualizar la cache de react query:
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



//hook para actualizar un paciente existente y actualizar la cache de react query:
export function useUpdatePatientMutation() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, patientData }: { id: number; patientData: Partial<Omit<Patient, "id">> }) => {
            return updatePatient(id, patientData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["patients"],
            });
        },
    });
}



//hook para eliminar un paciente existente y actualizar la cache de react query:
export function useDeletePatientMutation() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return deletePatient(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["patients"],
            });
        },
    });
}


