
import React from "react";
import {
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "./chart";

interface ChartProps {
  data: any[];
  categories: string[];
  index: string;
  colors: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export const AreaChart = ({
  data,
  categories,
  index,
  colors,
  valueFormatter = (value) => `${value}`,
  className,
}: ChartProps) => {
  return (
    <ChartContainer
      className={className}
      config={{
        ...categories.reduce(
          (acc, category, i) => ({
            ...acc,
            [category]: {
              color: colors[i % colors.length],
            },
          }),
          {}
        ),
      }}
    >
      <RechartsAreaChart data={data}>
        <defs>
          {categories.map((category, i) => (
            <linearGradient
              key={category}
              id={`color-${category}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={colors[i % colors.length]}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={colors[i % colors.length]}
                stopOpacity={0}
              />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey={index}
          tick={{ fill: "var(--foreground)" }}
          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
        />
        <YAxis
          tick={{ fill: "var(--foreground)" }}
          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
        />
        <Tooltip content={<ChartTooltipContent />} />
        {categories.map((category, i) => (
          <Area
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            fillOpacity={1}
            fill={`url(#color-${category})`}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  );
};

export const BarChart = ({
  data,
  categories,
  index,
  colors,
  valueFormatter = (value) => `${value}`,
  className,
}: ChartProps) => {
  return (
    <ChartContainer
      className={className}
      config={{
        ...categories.reduce(
          (acc, category, i) => ({
            ...acc,
            [category]: {
              color: colors[i % colors.length],
            },
          }),
          {}
        ),
      }}
    >
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey={index}
          tick={{ fill: "var(--foreground)" }}
          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
        />
        <YAxis
          tick={{ fill: "var(--foreground)" }}
          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
        />
        <Tooltip content={<ChartTooltipContent />} />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};
