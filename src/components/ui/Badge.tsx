import clsx from "clsx";
import { ReactNode } from "react";

type BadgeTone = "safe" | "warning" | "danger" | "neutral" | "accent";

const toneClasses: Record<BadgeTone, string> = {
  safe: "bg-[var(--safe-dim)] text-[var(--safe)] border-[var(--safe)]/25",
  warning: "bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning)]/25",
  danger: "bg-[var(--danger-dim)] text-[var(--danger)] border-[var(--danger)]/25",
  neutral: "bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]",
  accent: "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--accent)]/25",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-mono font-medium tracking-wide",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
