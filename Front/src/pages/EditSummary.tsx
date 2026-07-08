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

    // Si el summary cambia desde el padre, actualiza el estado local

    useEffect(() => {
        setEditedSummary(summary);
    }, [summary]);

    // Guarda el resumen editado
    function saveEditedSummary() {
        setSaving(true);
        setError(null);

        editSummary(consultationId, editedSummary)

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
            <h2>Edit Summary</h2>

            <textarea
                value={editedSummary}
                disabled={saving}
                onChange={(e) => setEditedSummary(e.target.value)}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button

                onClick={saveEditedSummary}
                disabled={saving || editedSummary === summary}
            >

                {saving ? "Saving..." : "Save"}
            </button>
            
        </div>
    );
}