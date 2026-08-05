"use client";

import { useState, FormEvent } from "react";
import { Card, CardHeader } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Direction } from "@/lib/types";
import clsx from "clsx";

interface AddTradeFormProps {
  onAdd: (trade: { asset: string; direction: Direction; pnl: number }) => void;
  onReset: () => void;
  isModified: boolean;
}

export function AddTradeForm({ onAdd, onReset, isModified }: AddTradeFormProps) {
  const [asset, setAsset] = useState("");
  const [direction, setDirection] = useState<Direction>("Long");
  const [pnlInput, setPnlInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmedAsset = asset.trim().toUpperCase();
    const pnl = Number(pnlInput);

    if (!trimmedAsset) {
      setError("Enter an asset symbol, e.g. BTC.");
      return;
    }
    if (pnlInput.trim() === "" || Number.isNaN(pnl)) {
      setError("Enter a valid P&L amount.");
      return;
    }
    if (pnl === 0) {
      setError("P&L can't be zero — a trade either won or lost.");
      return;
    }

    onAdd({ asset: trimmedAsset, direction, pnl });
    setAsset("");
    setPnlInput("");
    setError(null);
  }

  return (
    <Card>
      <CardHeader
        eyebrow="Try it yourself"
        title="Add a Trade"
        right={
          isModified ? (
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] font-mono text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-2"
            >
              Reset to session data
            </button>
          ) : (
            <Badge tone="neutral">Live recalculation</Badge>
          )
        }
      />
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
        <p className="text-[12px] text-[var(--text-muted)] -mt-1">
          Nothing above is hardcoded — add a trade and every stat, gauge, and the
          risk status recompute instantly.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <label className="flex flex-col gap-1.5 min-w-0">
            <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--text-faint)] font-mono">
              Asset
            </span>
            <input
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              placeholder="BTC"
              maxLength={8}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] outline-none transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1.5 min-w-0">
            <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--text-faint)] font-mono">
              Direction
            </span>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as Direction)}
              className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-sm font-mono text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
            >
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 min-w-0 col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--text-faint)] font-mono">
              P&amp;L ($)
            </span>
            <input
              value={pnlInput}
              onChange={(e) => setPnlInput(e.target.value)}
              placeholder="e.g. 500 or -250"
              inputMode="decimal"
              className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] outline-none transition-colors"
            />
          </label>

          <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-[0.06em] text-transparent font-mono select-none hidden sm:block">
              .
            </span>
            <button
              type="submit"
              className={clsx(
                "rounded-md px-3 py-1.5 text-sm font-medium font-display transition-colors",
                "bg-[var(--accent)] text-[#081018] hover:brightness-110 active:brightness-95"
              )}
            >
              Add Trade
            </button>
          </div>
        </div>
        {error && (
          <p className="text-[12px] text-[var(--danger)] font-mono">{error}</p>
        )}
      </form>
    </Card>
  );
}
