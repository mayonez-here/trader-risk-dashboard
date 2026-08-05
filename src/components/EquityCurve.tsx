"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Card, CardHeader } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { EquityPoint, formatCurrency } from "@/lib/calculations";

interface EquityCurveProps {
  data: EquityPoint[];
  startingBalance: number;
  maxDrawdownLimit: number;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: EquityPoint }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-[12px] font-mono shadow-lg">
      <p className="text-[var(--text-faint)] mb-1">{point.label}</p>
      <p className="text-[var(--text-primary)]">Balance: {formatCurrency(point.balance)}</p>
      <p className="text-[var(--text-muted)]">Peak: {formatCurrency(point.peak)}</p>
    </div>
  );
}

export function EquityCurve({ data, startingBalance }: EquityCurveProps) {
  return (
    <Card>
      <CardHeader
        eyebrow="Added Feature"
        title="Equity Curve"
        right={<Badge tone="accent">Trajectory, not just totals</Badge>}
      />
      <div className="p-4 pt-5">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border-soft)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--text-faint)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
                interval={0}
                tickFormatter={(v: string) => (v === "Start" ? "Start" : v.split(" ")[0])}
              />
              <YAxis
                tick={{ fill: "var(--text-faint)", fontSize: 11, fontFamily: "var(--font-mono)" }}
                axisLine={false}
                tickLine={false}
                domain={["dataMin - 500", "dataMax + 500"]}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                width={44}
              />
              <ReferenceLine
                y={startingBalance}
                stroke="var(--text-faint)"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="var(--accent)"
                strokeWidth={2}
                fill="url(#equityFill)"
                dot={{ r: 3, fill: "var(--accent)", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[12px] text-[var(--text-muted)] mt-3 leading-relaxed">
          The end-of-session P&amp;L is positive, but the curve shows two pullbacks
          along the way. Drawdown is measured from the highest point this balance ever
          reached — not from the starting balance — so this view explains{" "}
          <em>why</em> the risk gauges above read the way they do.
        </p>
      </div>
    </Card>
  );
}
