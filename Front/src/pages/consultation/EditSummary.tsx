import { useEffect, useState } from "react";
import { editSummary } from "@/services/consultations.service";
import type { EditSummaryProps } from "@/types/editSummary";
import type { SummaryFields } from "@/types/editSummary";
import { parseSummary, serializeSummary } from "@/utils/summary";

const inputClass = "neu-inset w-full mt-1.5 px-3 py-2 text-sm bg-card/70 rounded-lg border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50";
const labelClass = "font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground select-none";

export default function EditSummary({ consultationId, summary }: EditSummaryProps) {

    const parsedFromProp = parseSummary(summary);

    const [fields, setFields] = useState(parsedFromProp);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    // actualizar campos si cambia el prop
    useEffect(() => {
        setFields(parseSummary(summary));
    }, [summary]);

    function updateField(field: keyof SummaryFields, value: string) {
        setFields((prev) => prev && { ...prev, [field]: value });
        setSaved(false);
    }

    function saveEditedSummary() {
        if (!fields) return;

        setSaving(true);
        setError(null);
        setSaved(false);

        editSummary(consultationId, serializeSummary(fields))
            .then(() => {
                setSaved(true);
            })
            .catch((err) => {
                console.error("Error saving edited summary:", err);
                setError("Error saving edited summary");
                setFields(parsedFromProp);
            })
            .finally(() => {
                setSaving(false);
            });
    }

    // manejar error de parseo
    if (!fields) {
        return <p className="font-mono text-xs uppercase tracking-wider text-destructive">Could not read the summary.</p>;
    }

    const isUnchanged = serializeSummary(fields) === serializeSummary(parsedFromProp!);

    return (
        <div className="flex flex-col gap-5">
            <div>
                <label className={labelClass}>Chief complaint</label>
                <input
                    type="text"
                    value={fields.chief_complaint}
                    disabled={saving}
                    onChange={(e) => updateField("chief_complaint", e.target.value)}
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass}>Symptoms</label>
                <input
                    type="text"
                    value={fields.symptoms}
                    disabled={saving}
                    placeholder="Separated by commas"
                    onChange={(e) => updateField("symptoms", e.target.value)}
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass}>Diagnosis</label>
                <textarea
                    value={fields.diagnosis}
                    disabled={saving}
                    onChange={(e) => updateField("diagnosis", e.target.value)}
                    className={`${inputClass} min-h-[90px] resize-none`}
                />
            </div>

            <div>
                <label className={labelClass}>Treatment</label>
                <textarea
                    value={fields.treatment}
                    disabled={saving}
                    onChange={(e) => updateField("treatment", e.target.value)}
                    className={`${inputClass} min-h-[90px] resize-none`}
                />
            </div>

            <div>
                <label className={labelClass}>Follow up</label>
                <input
                    type="text"
                    value={fields.follow_up}
                    disabled={saving}
                    onChange={(e) => updateField("follow_up", e.target.value)}
                    className={inputClass}
                />
            </div>

            {error && <p className="font-mono text-xs uppercase tracking-wider text-destructive bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</p>}

            <div className="flex items-center gap-3.5 pt-1">
                <button
                    onClick={saveEditedSummary}
                    disabled={saving || isUnchanged}
                    className="neu-card bg-primary hover:bg-navy-elevated text-white rounded-md px-4 py-2 border border-navy-elevated text-[11px] font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {saving ? "Saving..." : "Save"}
                </button>

                {saved && (
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-navy-elevated flex items-center gap-1.5 animate-fade-in">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Saved
                    </span>
                )}
            </div>
        </div>
    );
}
