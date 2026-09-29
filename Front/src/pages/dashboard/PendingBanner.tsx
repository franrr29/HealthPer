import { ArrowRight, PenLine } from "lucide-react";

interface PendingBannerProps {
  count: number;
}

export function PendingBanner({ count }: PendingBannerProps) {
  if (count === 0) return null;

  return (
    <div
      role="status"
      className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-card p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <PenLine aria-hidden="true" className="h-4.5 w-4.5" />
        </span>
        <p className="text-sm font-medium text-foreground">
          You have <span className="font-bold">{count} {count === 1 ? "consultation" : "consultations"}</span> waiting for your signature.
        </p>
      </div>
      <a
        href="#pending-signatures"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-wc-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-wc-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wc-blue focus-visible:ring-offset-2"
      >
        Review Now
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </a>
    </div>
  );
}
