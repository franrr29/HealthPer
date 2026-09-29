import { CheckCircle2, Eye, PencilLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const statusStyle: Record<string, { label: string; pill: string; icon: LucideIcon }> = {
  signed: { label: "Signed", pill: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  reviewed: { label: "Reviewed", pill: "bg-wc-blue/10 text-wc-blue", icon: Eye },
  draft: { label: "Draft", pill: "bg-amber-100 text-amber-800", icon: PencilLine },
};

export function ConsultationStatusBadge({ status }: { status: string }) {
  const style = statusStyle[status] ?? { label: status, pill: "bg-slate-100 text-slate-700", icon: PencilLine };
  const Icon = style.icon;

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style.pill}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {style.label}
    </span>
  );
}
