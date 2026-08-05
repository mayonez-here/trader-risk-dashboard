import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}

export function Card({ children, className, as = "div" }: CardProps) {
  const Comp = as;
  return (
    <Comp
      className={clsx(
        "rounded-xl border border-[var(--border)] bg-[var(--surface)]",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.02)_inset]",
        className
      )}
    >
      {children}
    </Comp>
  );
}

interface CardHeaderProps {
  eyebrow?: string;
  title: string;
  right?: ReactNode;
}

export function CardHeader({ eyebrow, title, right }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-[var(--border-soft)]">
      <div>
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-faint)] font-mono mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-[15px] font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
      </div>
      {right}
    </div>
  );
}
