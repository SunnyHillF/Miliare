"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

interface EarningsOverviewChartProps {
  data: { month: string; earnings: number }[];
  config: ChartConfig;
}

export default function EarningsOverviewChart({
  data,
  config,
}: EarningsOverviewChartProps) {
  return (
    <ChartContainer config={config} className="w-full h-56">
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="earnings"
          stroke="#1566C0"
          strokeWidth={3}
          dot={{ r: 5 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
