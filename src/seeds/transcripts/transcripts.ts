//importa todo los transcripts creados:
import { cardiologyTranscripts } from "./cardiology";
import { dermatologyTranscripts } from "./dermatology";
import { endocrinologyTranscripts } from "./endocrinology";
import { generalMedicineTranscripts } from "./generalMed";
import { neurologyTranscripts } from "./neurology";
import { oncologyTranscripts } from "./oncology";
import { pediatricsTranscripts } from "./pediatric";
import { traumatologyTranscripts } from "./traumatology";


//Unir todo en una constante sola para poder agregar mas a futuro:

export const transcripts: string[][] = [
  ...cardiologyTranscripts,
  ...pediatricsTranscripts,
  ... dermatologyTranscripts,
  ... endocrinologyTranscripts,
  ...generalMedicineTranscripts,
  ... neurologyTranscripts,
  ...oncologyTranscripts,
  ... traumatologyTranscripts
];