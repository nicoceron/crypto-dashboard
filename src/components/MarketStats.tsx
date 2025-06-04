"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  PieChart,
  Users,
} from "lucide-react";
import { coinGeckoApi } from "@/services/coinGeckoApi";
import {
  formatNumber,
  formatPercentage,
  getChangeColor,
} from "@/utils/formatters";

interface GlobalMarketData {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    market_cap_change_percentage_24h_usd: number;
    active_cryptocurrencies: number;
    markets: number;
  };
}

export const MarketStats: React.FC = () => {
  const [marketData, setMarketData] = useState<GlobalMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setError(null);
        const data = await coinGeckoApi.getGlobalMarketData();
        setMarketData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch market data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();

    // Update every 90 seconds with API key
    const interval = setInterval(fetchMarketData, 90000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !marketData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <p className="text-red-600 font-semibold">Error loading market data</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Market Cap",
      value: formatNumber(marketData.data.total_market_cap.usd, 2),
      change: marketData.data.market_cap_change_percentage_24h_usd,
      icon: DollarSign,
      prefix: "$",
    },
    {
      title: "24h Trading Volume",
      value: formatNumber(marketData.data.total_volume.usd, 2),
      icon: Activity,
      prefix: "$",
    },
    {
      title: "Bitcoin Dominance",
      value: marketData.data.market_cap_percentage.btc.toFixed(1),
      icon: PieChart,
      suffix: "%",
    },
    {
      title: "Active Cryptocurrencies",
      value: formatNumber(marketData.data.active_cryptocurrencies),
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                {stat.title}
              </h3>
            </div>
          </div>

          <div className="mb-2">
            <span className="text-2xl font-bold text-gray-900">
              {stat.prefix && stat.prefix}
              {stat.value}
              {stat.suffix && stat.suffix}
            </span>
          </div>

          {stat.change !== undefined && (
            <div
              className={`flex items-center gap-1 ${getChangeColor(
                stat.change
              )}`}
            >
              {stat.change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">
                {formatPercentage(stat.change)} (24h)
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
