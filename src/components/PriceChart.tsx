"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { HistoricalPrice } from "@/types/crypto";
import { coinGeckoApi } from "@/services/coinGeckoApi";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface PriceChartProps {
  coinId: string;
  coinName: string;
  days?: number;
}

interface ChartData {
  timestamp: number;
  price: number;
  volume: number;
  marketCap: number;
  date: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    value: number;
  }>;
  label?: string | number;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  coinId,
  coinName,
  days = 7,
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(days);
  const [chartType, setChartType] = useState<"line" | "area">("area");

  const periods = [
    { label: "24H", days: 1 },
    { label: "7D", days: 7 },
    { label: "30D", days: 30 },
    { label: "90D", days: 90 },
    { label: "1Y", days: 365 },
  ];

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: HistoricalPrice = await coinGeckoApi.getHistoricalPrices(
          coinId,
          selectedPeriod
        );

        const formattedData: ChartData[] = data.prices.map(
          ([timestamp, price], index) => ({
            timestamp,
            price,
            volume: data.total_volumes[index]?.[1] || 0,
            marketCap: data.market_caps[index]?.[1] || 0,
            date: formatDate(timestamp),
          })
        );

        setChartData(formattedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch chart data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [coinId, selectedPeriod]);

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.date}</p>
          <p className="text-blue-600">
            Price:{" "}
            <span className="font-semibold">{formatCurrency(data.price)}</span>
          </p>
          <p className="text-gray-600">
            Volume:{" "}
            <span className="font-semibold">
              {formatCurrency(data.volume, 0)}
            </span>
          </p>
          <p className="text-gray-600">
            Market Cap:{" "}
            <span className="font-semibold">
              {formatCurrency(data.marketCap, 0)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error loading chart data</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const currentPrice = chartData[chartData.length - 1]?.price || 0;
  const previousPrice = chartData[0]?.price || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice
    ? (priceChange / previousPrice) * 100
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {coinName} Price Chart
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(currentPrice)}
            </span>
            <span
              className={`text-lg font-semibold ${
                priceChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {priceChange >= 0 ? "+" : ""}
              {formatCurrency(priceChange)} ({priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 lg:mt-0">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.days}
                onClick={() => setSelectedPeriod(period.days)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period.days
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType("area")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === "area"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartType === "line"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="timestamp"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return selectedPeriod === 1
                    ? date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickFormatter={(value) => formatCurrency(value, 2)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="timestamp"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return selectedPeriod === 1
                    ? date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickFormatter={(value) => formatCurrency(value, 2)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: "#3B82F6" }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
