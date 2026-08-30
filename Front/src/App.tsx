import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@/pages/auth/Login"
import Dashboard from "@/pages/dashboard/Dashboard"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import AuthProvider from "./context/AuthContext"
import AuthCallback from "@/pages/auth/AuthCallback"
import AppLayout from "@/layouts/AppLayout"
import Patients from "@/pages/patients/Patients"
import PatientDetails from "@/pages/patients/PatientDetails"
import { CreatePatient } from "@/pages/patients/CreatePatient"
import { EditPatient } from "@/pages/patients/EditPatient"
import ConsultationFlow from "./pages/consultation/ConsultationFlow"
import Welcome from "./pages/welcome/Welcome"
import ErrorBoundary from "./components/common/ErrorBoundary"
import NotFound from "./pages/NotFound"
import ScrollToTop from "./components/common/ScrollToTop"


export default function App() {
  
  return (
    <AuthProvider>
      <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* rutas publicas */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* rutas protegidas: necesitan sesion */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:patientId/consultations/:consultationId" element={<ConsultationFlow />} />
              <Route path="/patients/new" element={<CreatePatient />} />
              <Route path="/patients/:id/edit" element={<EditPatient />} />
              <Route path="/patients/:id" element={<PatientDetails />} />
            </Route>
          </Route>

          {/* cualquier otra cosa a NotFound */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  )
}