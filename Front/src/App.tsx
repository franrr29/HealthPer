import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import ProtectedRoute from "@/components/ui/ProtectedRoute"
import AuthProvider from "./context/AuthContext"
import AuthCallback from "@/pages/AuthCallback"
import AppLayout from "@/layouts/AppLayout"
import Patients from "@/pages/Patients"
import PatientDetails from "@/pages/PatientDetails"
import { CreatePatient } from "@/pages/CreatePatient"
import { EditPatient } from "@/pages/EditPatient"
import ConsultationFlow from "./pages/ConsultationFlow"

export default function App() {
  return (
    
    
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:patientId/consultations/:consultationId" element={<ConsultationFlow />} />
              <Route path="/patients/new" element={<CreatePatient />} />
              <Route path="/patients/:id/edit" element={<EditPatient />} />
              <Route path="/patients/:id" element={<PatientDetails />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}