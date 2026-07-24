
export interface DoctorStats {
  totalConsultations: number;
  pendingDrafts: number;
  recentConsultations: {
    id: number;
    status: string;
    created_at: string;
    patient_id: number;
    patient_name: string;
  }[];
}


export interface RecentActivity {
  consultation_id: number;
  patient_name: string;
  timestamp: string;
  status: string;
}

export interface TopConditions {
  topChronicDiseases: { condition: string; patientCount: number }[];
  topAllergies: { allergy: string; patientCount: number }[];
}

export interface DoctorHeaderProps {
  doctorData?: {
    name?: string;
    specialty?: string;
    license?: string;
    facility?: string;
  };
}
