"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import useSWR from "swr";
import { formatCurrency } from "@/utils/formatters";
import { LoadingSpinner } from "./LoadingSpinner";
import { TrendingUp, TrendingDown, Calendar, Activity } from "lucide-react";

interface PriceChartProps {
  coinId: string;
  coinName: string;
  days?: number;
}

interface ChartPoint {
  timestamp: number;
  price: number;
  date: Date;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: number;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch chart data");
  }
  return response.json();
};

export const PriceChart: React.FC<PriceChartProps> = ({
  coinId,
  coinName,
  days = 7,
}) => {
  const [selectedDays, setSelectedDays] = useState(days);
  const [chartType, setChartType] = useState<"line" | "area">("area");

  const { data, error, isLoading } = useSWR(
    `/api/crypto/${coinId}/chart?days=${selectedDays}`,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: false,
    }
  );

  const timeframes = [
    { days: 1, label: "24H", icon: Activity },
    { days: 7, label: "7D", icon: Calendar },
    { days: 30, label: "30D", icon: Calendar },
    { days: 90, label: "90D", icon: Calendar },
    { days: 365, label: "1Y", icon: Calendar },
  ];

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 font-medium">
              Loading chart data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div className="p-4 bg-red-100 rounded-xl mb-4">
              <div className="text-red-600 font-bold text-lg mb-2">
                Chart unavailable
              </div>
              <p className="text-red-700">
                Unable to load price data for this timeframe
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.prices || data.prices.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600 font-medium">No chart data available</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData: ChartPoint[] = data.prices.map(
    ([timestamp, price]: [number, number]) => ({
      timestamp,
      price,
      date: new Date(timestamp),
    })
  );

  const firstPrice = chartData[0]?.price || 0;
  const lastPrice = chartData[chartData.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = firstPrice ? (priceChange / firstPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  const formatXAxisLabel = (tickItem: number) => {
    const date = new Date(tickItem);
    if (selectedDays === 1) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (selectedDays <= 7) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (selectedDays <= 30) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length && label) {
      const date = new Date(label);
      const price = payload[0].value;

      return (
        <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-2xl border border-white/20">
          <div className="text-sm font-semibold text-gray-600 mb-1">
            {date.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(price)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Chart Header */}
      <div className="p-8 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {coinName} Price Chart
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(lastPrice)}
                </span>
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                    isPositive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {formatCurrency(Math.abs(priceChange))} (
                  {priceChangePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Chart Type Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setChartType("area")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  chartType === "area"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  chartType === "line"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Line
              </button>
            </div>

            {/* Timeframe Buttons */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {timeframes.map(({ days: frameDays, label, icon: Icon }) => (
                <button
                  key={frameDays}
                  onClick={() => setSelectedDays(frameDays)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    selectedDays === frameDays
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-8">
        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer>
            {chartType === "area" ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPositive ? "#10B981" : "#EF4444"}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPositive ? "#10B981" : "#EF4444"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxisLabel}
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "#10B981" : "#EF4444"}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxisLabel}
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "#10B981" : "#EF4444"}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: isPositive ? "#10B981" : "#EF4444" }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
