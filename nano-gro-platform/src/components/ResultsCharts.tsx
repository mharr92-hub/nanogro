"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export interface ChartDatum {
  name: string;
  value: number;
  n: number;
}

export function ResultsCharts({ byCrop, byCountry }: { byCrop: ChartDatum[]; byCountry: ChartDatum[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Chart data={byCrop} color="#1f7a4d" suffix="%" />
      <Chart data={byCountry} color="#155c39" suffix="" />
    </div>
  );
}

function Chart({ data, color, suffix }: { data: ChartDatum[]; color: string; suffix: string }) {
  return (
    <div className="h-72 w-full rounded-xl border border-border bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number, _n, p) => [`${v}${suffix} (n=${p.payload.n})`, ""]} />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
