import { useEffect, useState } from "react";
import { editSummary } from "@/services/consultations.service";

type EditSummaryProps = {
    consultationId: number;
    summary: string;
};

export default function EditSummary({consultationId,summary,}: EditSummaryProps) {

    const [editedSummary, setEditedSummary] = useState(summary);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    // Si el summary cambia desde el padre, actualiza el estado local

    useEffect(() => {
        setEditedSummary(summary);
    }, [summary]);

    // Guarda el resumen editado
    function saveEditedSummary() {
        setSaving(true);
        setError(null);
        setSaved(false);

        editSummary(consultationId, editedSummary)

            .then(() => {
                //muestro el check de guardado ok
                setSaved(true);
            })

            .catch((err) => {
                console.error("Error saving edited summary:", err);
                setError("Error saving edited summary");
                setEditedSummary(summary);
            })

            .finally(() => {
                setSaving(false);
            });
    }

    return (
        <div>
            <textarea
                value={editedSummary}
                disabled={saving}
                onChange={(e) => {
                    setEditedSummary(e.target.value);
                    setSaved(false);
                }}
                className="w-full min-h-[200px] px-4 py-3 rounded-xl border border-border text-foreground resize-none focus:outline-none focus:border-primary disabled:opacity-50"
            />

            {error && <p className="text-sm text-destructive mt-2">{error}</p>}

            <div className="flex items-center gap-3 mt-3">
                <button
                    onClick={saveEditedSummary}
                    disabled={saving || editedSummary === summary}
                    className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? "Saving..." : "Save"}
                </button>

                {/* aviso verde cuando guardo bien */}
                {saved && <span className="text-sm text-green-600 font-medium">✓ Saved</span>}
            </div>
        </div>
    );
}