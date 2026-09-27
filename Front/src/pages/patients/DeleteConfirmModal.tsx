interface DeleteConfirmModalProps {
  patientName: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ patientName, isDeleting, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200">
      <div className="neu-card rounded-2xl bg-card p-5 border border-border/80 w-full max-w-sm space-y-4 transition-all duration-200 transform scale-100">
        <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
          Delete patient
        </h3>
        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="text-foreground font-bold">{patientName}</span>? This can't be undone.
        </p>
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="neu-card inline-flex items-center gap-2 bg-card text-foreground rounded-xl px-3 py-1.5 border border-border text-[11px] font-bold uppercase tracking-wider hover:brightness-95 transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="neu-card inline-flex items-center gap-2 bg-rose-600 text-white rounded-xl px-3 py-1.5 border border-rose-700/60 text-[11px] font-bold uppercase tracking-wider hover:brightness-110 transition-all duration-200 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Confirm delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
