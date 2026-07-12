
export interface DoctorStats {
  totalConsultations: number;
  pendingDrafts: number;
  recentConsultations: {
    id: number;
    status: string;
    created_at: string;
    patient_name: string;
  }[];
}

