import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { previewPatientEmail, sendPatientEmail } from '@/services/email.service';
import type { SendEmailPatientProps } from '@/types/email';

export default function SendEmailPatient({ consultationId, patientId }: SendEmailPatientProps) {

    const [step, setStep] = useState<"idle" | "inputEmail" | "loadingPreview" | "preview" | "sending" | "sent">("idle");
    const [email, setEmail] = useState('');
    const [previewHTML, setPreviewHTML] = useState('');
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    // genera el preview del email llamando al backend
    async function handleGeneratePreview() {
        setError(null);
        setStep("loadingPreview");

        try {
            const html = await previewPatientEmail(consultationId);
            setPreviewHTML(html);
            setStep("preview");
        } catch (err) {
            setError("Failed to generate preview");
            setStep("inputEmail");
        }
    }

    // envia el email al paciente con el contenido aprobado
    async function handleSendEmail() {
        setError(null);
        setStep("sending");

        try {
            await sendPatientEmail(consultationId, email, previewHTML);
            setStep("sent");
            setTimeout(() => navigate(`/patients/${patientId}`), 1500);
        } catch (err) {
            setError("Failed to send email");
            setStep("preview");
        }
    }

    return (
        <div className="space-y-4">

            {step === "idle" && (
                <div className="flex gap-3">
                    <button
                        onClick={() => setStep("inputEmail")}
                        className="neu-card bg-[#2F3B35] hover:bg-[#3B4A42] text-white rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider border border-[#3B4A42] transition-all duration-200"
                    >
                        Send summary to patient
                    </button>
                    <button
                        onClick={() => navigate(`/patients/${patientId}`)}
                        className="neu-card bg-card text-foreground hover:brightness-95 rounded-xl px-4 py-2 border border-border text-xs font-bold uppercase tracking-wider transition-all duration-200"
                    >
                        Skip
                    </button>
                </div>
            )}

            {step === "inputEmail" && (
                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder="Patient email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#5E7367]"
                    />
                    <button
                        onClick={handleGeneratePreview}
                        disabled={!email.trim()}
                        className="neu-card bg-[#2F3B35] hover:bg-[#3B4A42] text-white rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider border border-[#3B4A42] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Generate preview
                    </button>
                </div>
            )}

            {step === "loadingPreview" && (
                <div className="flex items-center gap-2.5 text-xs text-[#4C5F54] bg-[#F2EEE3] p-3 rounded-lg border border-[#DDE6E0] animate-pulse">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#5E7367] border-t-transparent animate-spin" />
                    Generating email preview...
                </div>
            )}

            {step === "preview" && (
                <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-white p-4 shadow-sm"
                         dangerouslySetInnerHTML={{ __html: previewHTML }}
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={handleSendEmail}
                            className="neu-card bg-[#769283] hover:brightness-110 text-white rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider border border-[#5E7367]/60 transition-all duration-200"
                        >
                            Confirm and send
                        </button>
                        <button
                            onClick={() => setStep("inputEmail")}
                            className="neu-card bg-card text-foreground hover:brightness-95 rounded-xl px-4 py-2 border border-border text-xs font-bold uppercase tracking-wider transition-all duration-200"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}

            {step === "sending" && (
                <div className="flex items-center gap-2.5 text-xs text-[#4C5F54] bg-[#F2EEE3] p-3 rounded-lg border border-[#DDE6E0] animate-pulse">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#5E7367] border-t-transparent animate-spin" />
                    Sending email...
                </div>
            )}

            {step === "sent" && (
                <div className="text-xs font-bold text-[#4C5F54] bg-[#F2EEE3] border border-[#DDE6E0] rounded-lg p-4 text-center animate-pulse">
                    Email sent successfully. Redirecting...
                </div>
            )}

            {error && (
                <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">
                    {error}
                </p> )}
        </div>
    );
}