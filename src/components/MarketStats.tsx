"use client";

import React from "react";
import useSWR from "swr";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Globe,
} from "lucide-react";

interface GlobalMarketData {
  data: {
    total_market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap_percentage: {
      btc: number;
      eth: number;
    };
    market_cap_change_percentage_24h_usd: number;
  };
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch global market data");
  }
  return response.json();
};

export const MarketStats: React.FC = () => {
  const { data, error, isLoading } = useSWR<GlobalMarketData>(
    "/api/market/global",
    fetcher,
    {
      refreshInterval: 120000, // Refresh every 2 minutes
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-3"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mb-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center">
            <div className="p-3 bg-red-100 rounded-xl mb-4 inline-block">
              <Globe className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-red-700 font-medium">
              Unable to load global market data
            </p>
          </div>
        </div>
      </div>
    );
  }

  const globalData = data.data;
  const marketCapChange = globalData.market_cap_change_percentage_24h_usd;
  const isMarketCapPositive = marketCapChange >= 0;

  const stats = [
    {
      title: "Total Market Cap",
      value: formatCurrency(globalData.total_market_cap.usd, 0),
      change: marketCapChange,
      changeFormatted: formatPercentage(marketCapChange),
      icon: DollarSign,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "24h Trading Volume",
      value: formatCurrency(globalData.total_volume.usd, 0),
      icon: BarChart3,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Bitcoin Dominance",
      value: `${globalData.market_cap_percentage.btc.toFixed(1)}%`,
      icon: Activity,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
    {
      title: "Ethereum Dominance",
      value: `${globalData.market_cap_percentage.eth.toFixed(1)}%`,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                {stat.change !== undefined && (
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                      isMarketCapPositive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isMarketCapPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.changeFormatted}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.value}
                </p>
              </div>

              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
